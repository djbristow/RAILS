//! Docker Container & Process Monitor.
//!
//! A gui monitor for running Docker containers. All Docker API calls run on a
//! tokio runtime; results are sent to the UI thread over an mpsc channel and
//! applied at the start of each frame, so the UI never blocks on the network.

use std::collections::{HashMap, HashSet, VecDeque};
use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use bollard::container::{
    ListContainersOptions, LogsOptions, StatsOptions, TopOptions,
};
use bollard::errors::Error as DockerError;
use bollard::Docker;
use chrono::{DateTime, Utc};
use eframe::egui::{self, Align, Color32, Layout, RichText};
use egui_extras::{Column, TableBuilder};
use futures_util::StreamExt;
use tokio::runtime::{Handle, Runtime};
use tokio::sync::{watch, Semaphore};

const POLL_INTERVAL: Duration = Duration::from_secs(2);
const MAX_WORKERS: usize = 8;
const LOG_LINE_LIMIT: usize = 20_000;
const DOCKER_TIMEOUT: Duration = Duration::from_secs(10);

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

fn format_bytes(value: u64) -> String {
    let mut value = value as f64;
    for unit in ["B", "KiB", "MiB", "GiB"] {
        if value < 1024.0 {
            return format!("{value:.1}{unit}");
        }
        value /= 1024.0;
    }
    format!("{value:.1}TiB")
}

/// `{"80/tcp": [{"HostPort": "8080"}]}` -> `8080->80/tcp`
fn format_ports(ports: &HashMap<String, Option<Vec<bollard::models::PortBinding>>>) -> String {
    if ports.is_empty() {
        return "--".into();
    }
    let mut keys: Vec<&String> = ports.keys().collect();
    keys.sort();
    let mappings: Vec<String> = keys
        .into_iter()
        .map(|container_port| {
            let host_ports: Vec<&str> = ports[container_port]
                .iter()
                .flatten()
                .filter_map(|b| b.host_port.as_deref())
                .filter(|p| !p.is_empty())
                .collect();
            if host_ports.is_empty() {
                container_port.clone()
            } else {
                format!("{}->{}", host_ports.join(","), container_port)
            }
        })
        .collect();
    mappings.join(", ")
}

fn plural(n: i64, unit: &str) -> String {
    format!("{n} {unit}{}", if n == 1 { "" } else { "s" })
}

fn format_uptime(started_at: &str) -> String {
    if started_at.is_empty() || started_at.starts_with("0001-") {
        return "unknown".into();
    }
    match DateTime::parse_from_rfc3339(started_at) {
        Ok(start) => {
            let seconds = (Utc::now() - start.with_timezone(&Utc)).num_seconds().max(0);
            if seconds < 60 {
                format!("{seconds} seconds")
            } else if seconds < 3600 {
                plural(seconds / 60, "minute")
            } else if seconds < 86_400 {
                plural(seconds / 3600, "hour")
            } else {
                plural(seconds / 86_400, "day")
            }
        }
        Err(_) => "unknown".into(),
    }
}

/// Python-style `str.capitalize()`: first char upper, rest lower.
fn capitalize(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        Some(c) => c.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase(),
        None => String::new(),
    }
}

fn is_not_found(err: &DockerError) -> bool {
    matches!(
        err,
        DockerError::DockerResponseServerError { status_code: 404, .. }
    )
}

/// Docker sometimes returns an empty/invalid JSON body while a container is
/// stopping or restarting; such samples are skipped silently.
fn is_json_error(err: &DockerError) -> bool {
    matches!(
        err,
        DockerError::JsonDataError { .. } | DockerError::JsonSerdeError { .. }
    )
}

// ---------------------------------------------------------------------------
// Messages from workers to the UI thread
// ---------------------------------------------------------------------------

#[derive(Clone)]
struct ContainerInfo {
    id: String,
    name: String,
    short_id: String,
    status: String,
    ports: String,
}

struct ProcRow {
    command: String,
    cpu: String,
    mem: String,
    pid: String,
}

enum Msg {
    Snapshot(Vec<ContainerInfo>),
    Stats { id: String, cpu: String, mem: String, net: String },
    Processes { id: String, rows: Vec<ProcRow> },
    Remove(String),
    Error(String),
}

/// Sender that also wakes the UI so it repaints when a message arrives.
#[derive(Clone)]
struct Tx {
    tx: Sender<Msg>,
    ctx: egui::Context,
}

impl Tx {
    fn send(&self, msg: Msg) {
        let _ = self.tx.send(msg);
        self.ctx.request_repaint();
    }
}

/// State shared between the poller, the stats workers and the UI.
#[derive(Clone)]
struct Shared {
    inflight_stats: Arc<Mutex<HashSet<String>>>,
    inflight_procs: Arc<Mutex<HashSet<String>>>,
    prev_cpu: Arc<Mutex<HashMap<String, (u64, u64)>>>, // id -> (cpu total, system total)
    workers: Arc<Semaphore>,
}

impl Shared {
    fn new() -> Self {
        Self {
            inflight_stats: Default::default(),
            inflight_procs: Default::default(),
            prev_cpu: Default::default(),
            workers: Arc::new(Semaphore::new(MAX_WORKERS)),
        }
    }
}

// ---------------------------------------------------------------------------
// Background workers
// ---------------------------------------------------------------------------

async fn snapshot(docker: &Docker) -> Result<Vec<ContainerInfo>, DockerError> {
    let list = docker
        .list_containers(Some(ListContainersOptions::<String>::default()))
        .await?;
    let mut out = Vec::with_capacity(list.len());
    for summary in list {
        let Some(id) = summary.id else { continue };
        // list() omits start time and port bindings in the shape we want; inspect.
        let inspect = match docker.inspect_container(&id, None).await {
            Ok(i) => i,
            Err(e) if is_not_found(&e) => continue, // vanished between list and inspect
            Err(e) => return Err(e),
        };
        let state = inspect.state.unwrap_or_default();
        let raw_status = state
            .status
            .map(|s| s.to_string())
            .unwrap_or_else(|| "unknown".into());
        let raw_status = capitalize(&raw_status);
        let status = if raw_status.eq_ignore_ascii_case("running") {
            format!("Up {}", format_uptime(state.started_at.as_deref().unwrap_or("")))
        } else {
            raw_status
        };
        let ports = inspect
            .network_settings
            .and_then(|n| n.ports)
            .map(|p| format_ports(&p))
            .unwrap_or_else(|| "--".into());
        let name = inspect
            .name
            .unwrap_or_default()
            .trim_start_matches('/')
            .to_string();
        out.push(ContainerInfo {
            short_id: id.chars().take(12).collect(),
            id,
            name,
            status,
            ports,
        });
    }
    Ok(out)
}

/// Discovers containers every POLL_INTERVAL and kicks off one stats sample per
/// container (skipping any container whose previous sample is still running).
async fn poll_loop(docker: Docker, tx: Tx, shared: Shared, mut stop: watch::Receiver<bool>) {
    loop {
        match snapshot(&docker).await {
            Ok(snap) => {
                let ids: HashSet<&String> = snap.iter().map(|c| &c.id).collect();
                shared.prev_cpu.lock().unwrap().retain(|k, _| ids.contains(k));
                for info in &snap {
                    let newly_inserted = shared.inflight_stats.lock().unwrap().insert(info.id.clone());
                    if newly_inserted {
                        tokio::spawn(fetch_stats(
                            docker.clone(),
                            info.id.clone(),
                            tx.clone(),
                            shared.clone(),
                        ));
                    }
                }
                tx.send(Msg::Snapshot(snap));
            }
            Err(e) => tx.send(Msg::Error(format!("Error scanning Docker containers: {e}"))),
        }
        tokio::select! {
            _ = stop.changed() => return,
            _ = tokio::time::sleep(POLL_INTERVAL) => {}
        }
    }
}

fn compute_cpu_percent(
    stats: &bollard::container::Stats,
    prev: (u64, u64),
) -> (f64, (u64, u64)) {
    let cpu_total = stats.cpu_stats.cpu_usage.total_usage;
    let system_total = stats.cpu_stats.system_cpu_usage.unwrap_or(0);

    // Docker's precpu_stats is the previous sample used for this calculation.
    let pre_cpu = stats.precpu_stats.cpu_usage.total_usage;
    let pre_sys = stats.precpu_stats.system_cpu_usage.unwrap_or(0);
    let (prev_cpu, prev_sys) = if pre_cpu != 0 && pre_sys != 0 {
        (pre_cpu, pre_sys)
    } else {
        prev
    };

    let cpu_delta = cpu_total as f64 - prev_cpu as f64;
    let system_delta = system_total as f64 - prev_sys as f64;
    let online_cpus = stats
        .cpu_stats
        .online_cpus
        .filter(|&n| n > 0)
        .or_else(|| {
            stats
                .cpu_stats
                .cpu_usage
                .percpu_usage
                .as_ref()
                .map(|v| v.len() as u64)
                .filter(|&n| n > 0)
        })
        .unwrap_or(1) as f64;

    let pct = if cpu_delta > 0.0 && system_delta > 0.0 {
        (cpu_delta / system_delta * online_cpus * 100.0).max(0.0)
    } else {
        0.0
    };
    (pct, (cpu_total, system_total))
}

async fn fetch_stats(docker: Docker, id: String, tx: Tx, shared: Shared) {
    let _permit = shared.workers.acquire().await.ok();
    let result = tokio::time::timeout(DOCKER_TIMEOUT, async {
        let mut stream = docker.stats(
            &id,
            Some(StatsOptions { stream: false, one_shot: false }),
        );
        stream.next().await
    })
    .await;

    match result {
        Err(_) => tx.send(Msg::Error(format!("Error updating {}: timed out", &id[..12.min(id.len())]))),
        Ok(None) => {}
        Ok(Some(Err(e))) if is_not_found(&e) => tx.send(Msg::Remove(id.clone())),
        Ok(Some(Err(e))) if is_json_error(&e) => {} // transient; retry next cycle
        Ok(Some(Err(e))) => tx.send(Msg::Error(format!(
            "Error updating {}: {e}",
            &id[..12.min(id.len())]
        ))),
        Ok(Some(Ok(stats))) => {
            let prev = shared.prev_cpu.lock().unwrap().get(&id).copied().unwrap_or((0, 0));
            let (cpu_percent, sample) = compute_cpu_percent(&stats, prev);
            shared.prev_cpu.lock().unwrap().insert(id.clone(), sample);

            let mib = 1024.0 * 1024.0;
            let mem_usage = stats.memory_stats.usage.unwrap_or(0) as f64 / mib;
            let mem_limit = stats.memory_stats.limit.unwrap_or(0) as f64 / mib;
            let (rx, txb) = stats
                .networks
                .as_ref()
                .map(|n| {
                    n.values()
                        .fold((0u64, 0u64), |(r, t), v| (r + v.rx_bytes, t + v.tx_bytes))
                })
                .unwrap_or((0, 0));

            tx.send(Msg::Stats {
                id: id.clone(),
                cpu: format!("{cpu_percent:.2}%"),
                mem: format!("{mem_usage:.1} MiB / {mem_limit:.0} MiB"),
                net: format!("{} / {}", format_bytes(rx), format_bytes(txb)),
            });
        }
    }
    shared.inflight_stats.lock().unwrap().remove(&id);
}

async fn fetch_processes(docker: Docker, id: String, tx: Tx, shared: Shared) {
    let result = tokio::time::timeout(
        DOCKER_TIMEOUT,
        docker.top_processes(&id, Some(TopOptions { ps_args: "-aux" })),
    )
    .await;

    match result {
        Err(_) => tx.send(Msg::Error(format!(
            "Error fetching processes for {}: timed out",
            &id[..12.min(id.len())]
        ))),
        Ok(Err(e)) if is_not_found(&e) => tx.send(Msg::Remove(id.clone())),
        Ok(Err(e)) => tx.send(Msg::Error(format!(
            "Error fetching processes for {}: {e}",
            &id[..12.min(id.len())]
        ))),
        Ok(Ok(top)) => {
            let titles = top.titles.unwrap_or_default();
            let processes = top.processes.unwrap_or_default();
            let idx = |name: &str| titles.iter().position(|t| t == name);
            let pid_idx = idx("PID").unwrap_or(1);
            let cpu_idx = idx("%CPU");
            let mem_idx = idx("%MEM");
            let cmd_idx = idx("COMMAND");

            let rows = processes
                .iter()
                .map(|proc| {
                    let pid = proc.get(pid_idx).cloned().unwrap_or_else(|| "--".into());
                    let pct = |i: Option<usize>| {
                        i.and_then(|i| proc.get(i))
                            .map(|v| format!("{v}%"))
                            .unwrap_or_else(|| "--".into())
                    };
                    let command = cmd_idx
                        .and_then(|i| proc.get(i))
                        .or_else(|| proc.last())
                        .cloned()
                        .unwrap_or_else(|| "--".into());
                    ProcRow { command, cpu: pct(cpu_idx), mem: pct(mem_idx), pid }
                })
                .collect();
            tx.send(Msg::Processes { id: id.clone(), rows });
        }
    }
    shared.inflight_procs.lock().unwrap().remove(&id);
}

// ---------------------------------------------------------------------------
// Log viewer
// ---------------------------------------------------------------------------

/// Streams container logs, reconnecting after transient errors/timeouts.
/// Reconnects use tail=0 after the initial history to avoid repeating entries.
async fn stream_logs(
    docker: Docker,
    container_id: String,
    tx: Sender<String>,
    ctx: egui::Context,
    mut stop: watch::Receiver<bool>,
) {
    let send = |s: String| {
        let _ = tx.send(s);
        ctx.request_repaint();
    };
    let mut first_connection = true;

    loop {
        if *stop.borrow() {
            return;
        }
        match docker.inspect_container(&container_id, None).await {
            Err(e) if is_not_found(&e) => {
                send("\n--- Container was stopped or removed ---\n".into());
                return;
            }
            Err(e) => send(format!("\n--- Log stream interrupted ({e}); reconnecting ---\n")),
            Ok(_) => {
                let opts = LogsOptions::<String> {
                    follow: true,
                    stdout: true,
                    stderr: true,
                    timestamps: true,
                    tail: if first_connection { "200".into() } else { "0".into() },
                    ..Default::default()
                };
                first_connection = false;
                let mut stream = docker.logs(&container_id, Some(opts));
                loop {
                    tokio::select! {
                        _ = stop.changed() => return,
                        item = stream.next() => match item {
                            Some(Ok(chunk)) => {
                                send(String::from_utf8_lossy(&chunk.into_bytes()).into_owned());
                            }
                            Some(Err(e)) if is_not_found(&e) => {
                                send("\n--- Container was stopped or removed ---\n".into());
                                return;
                            }
                            Some(Err(e)) => {
                                send(format!("\n--- Log stream interrupted ({e}); reconnecting ---\n"));
                                break;
                            }
                            None => {
                                send("\n--- Log stream ended; reconnecting ---\n".into());
                                break;
                            }
                        }
                    }
                }
            }
        }
        tokio::select! {
            _ = stop.changed() => return,
            _ = tokio::time::sleep(Duration::from_secs(2)) => {}
        }
    }
}

struct LogWindow {
    id: u64,
    title: String,
    rx: Receiver<String>,
    lines: VecDeque<String>,
    partial: String, // trailing text of a chunk that didn't end in '\n'
    stop: watch::Sender<bool>,
    open: bool,
}

impl LogWindow {
    fn new(
        id: u64,
        handle: &Handle,
        docker: Docker,
        ctx: egui::Context,
        container_id: String,
        container_name: &str,
    ) -> Self {
        let (tx, rx) = channel();
        let (stop, stop_rx) = watch::channel(false);
        handle.spawn(stream_logs(docker, container_id.clone(), tx, ctx, stop_rx));
        Self {
            id,
            title: format!("Logs: {container_name} ({})", &container_id[..12.min(container_id.len())]),
            rx,
            lines: VecDeque::new(),
            partial: String::new(),
            stop,
            open: true,
        }
    }

    fn drain(&mut self) {
        while let Ok(chunk) = self.rx.try_recv() {
            self.partial.push_str(&chunk);
            while let Some(pos) = self.partial.find('\n') {
                let line: String = self.partial.drain(..=pos).collect();
                self.lines.push_back(line.trim_end_matches(['\n', '\r']).to_string());
            }
        }
        while self.lines.len() > LOG_LINE_LIMIT {
            self.lines.pop_front();
        }
    }

    fn show(&mut self, ctx: &egui::Context) {
        self.drain();
        let frame = egui::Frame::window(&ctx.style()).fill(Color32::from_rgb(0x1e, 0x1e, 0x1e));
        let mut open = self.open;
        egui::Window::new(&self.title)
            .id(egui::Id::new(("log-window", self.id)))
            .default_size([900.0, 500.0])
            .frame(frame)
            .open(&mut open)
            .show(ctx, |ui| {
                let row_h = ui.text_style_height(&egui::TextStyle::Monospace);
                egui::ScrollArea::both()
                    .auto_shrink([false, false])
                    .stick_to_bottom(true)
                    .show_rows(ui, row_h, self.lines.len(), |ui, range| {
                        for i in range {
                            ui.add(
                                egui::Label::new(
                                    RichText::new(&self.lines[i])
                                        .monospace()
                                        .color(Color32::from_rgb(0xd4, 0xd4, 0xd4)),
                                )
                                .wrap(false),
                            );
                        }
                    });
            });
        self.open = open;
    }
}

impl Drop for LogWindow {
    fn drop(&mut self) {
        // Wakes the worker even if it is blocked waiting for the next log line.
        let _ = self.stop.send(true);
    }
}

// ---------------------------------------------------------------------------
// Main application
// ---------------------------------------------------------------------------

struct ContainerRow {
    info: ContainerInfo,
    cpu: String,
    mem: String,
    net: String,
    expanded: bool,
    procs: Option<Vec<ProcRow>>, // None while loading
}

enum Action {
    Toggle(String),
    Select(String),
    Logs(String),
}

enum Line {
    Container(usize),
    Loading,
    Proc(usize, usize),
}

struct App {
    rt: Option<Runtime>,
    handle: Handle,
    docker: Option<Docker>,
    fatal: Option<String>,
    rx: Receiver<Msg>,
    tx: Tx,
    shared: Shared,
    stop: watch::Sender<bool>,
    containers: Vec<ContainerRow>,
    selected: Option<String>,
    log_windows: Vec<LogWindow>,
    next_window_id: u64,
    last_error: Option<String>,
}

impl App {
    fn new(
        cc: &eframe::CreationContext<'_>,
        rt: Runtime,
        docker: Result<Docker, DockerError>,
    ) -> Self {
        let (tx, rx) = channel();
        let tx = Tx { tx, ctx: cc.egui_ctx.clone() };
        let shared = Shared::new();
        let (stop, stop_rx) = watch::channel(false);
        let handle = rt.handle().clone();

        let (docker, fatal) = match docker {
            Ok(d) => {
                handle.spawn(poll_loop(d.clone(), tx.clone(), shared.clone(), stop_rx));
                (Some(d), None)
            }
            Err(e) => (None, Some(format!("Could not connect to Docker Engine:\n{e}"))),
        };

        Self {
            rt: Some(rt),
            handle,
            docker,
            fatal,
            rx,
            tx,
            shared,
            stop,
            containers: Vec::new(),
            selected: None,
            log_windows: Vec::new(),
            next_window_id: 0,
            last_error: None,
        }
    }

    /// Apply worker results; runs only on the UI thread.
    fn drain_messages(&mut self) {
        while let Ok(msg) = self.rx.try_recv() {
            match msg {
                Msg::Snapshot(snap) => {
                    let current: HashSet<&String> = snap.iter().map(|c| &c.id).collect();
                    self.containers.retain(|c| current.contains(&c.info.id));
                    for info in snap {
                        match self.containers.iter_mut().find(|c| c.info.id == info.id) {
                            Some(row) => {
                                row.info.status = info.status;
                                row.info.ports = info.ports;
                            }
                            None => self.containers.push(ContainerRow {
                                info,
                                cpu: "--".into(),
                                mem: "Loading...".into(),
                                net: "--".into(),
                                expanded: false,
                                procs: None,
                            }),
                        }
                    }
                }
                Msg::Stats { id, cpu, mem, net } => {
                    if let Some(row) = self.containers.iter_mut().find(|c| c.info.id == id) {
                        row.cpu = cpu;
                        row.mem = mem;
                        row.net = net;
                    }
                }
                Msg::Processes { id, rows } => {
                    if let Some(row) = self.containers.iter_mut().find(|c| c.info.id == id) {
                        row.procs = Some(rows);
                    }
                }
                Msg::Remove(id) => {
                    self.containers.retain(|c| c.info.id != id);
                    self.shared.prev_cpu.lock().unwrap().remove(&id);
                    self.shared.inflight_stats.lock().unwrap().remove(&id);
                    self.shared.inflight_procs.lock().unwrap().remove(&id);
                }
                Msg::Error(e) => {
                    // Console + status bar avoid modal dialogs on transient errors.
                    eprintln!("{e}");
                    self.last_error = Some(e);
                }
            }
        }
    }

    fn toggle(&mut self, id: &str) {
        let Some(docker) = self.docker.clone() else { return };
        let Some(row) = self.containers.iter_mut().find(|c| c.info.id == id) else { return };
        row.expanded = !row.expanded;
        if !row.expanded {
            return;
        }
        row.procs = None; // shows "Loading processes..." until the worker answers
        let newly_inserted = self.shared.inflight_procs.lock().unwrap().insert(id.to_string());
        if newly_inserted {
            self.handle.spawn(fetch_processes(
                docker,
                id.to_string(),
                self.tx.clone(),
                self.shared.clone(),
            ));
        }
    }

    fn open_logs(&mut self, id: &str) {
        let Some(docker) = self.docker.clone() else { return };
        let Some(row) = self.containers.iter().find(|c| c.info.id == id) else { return };
        let window = LogWindow::new(
            self.next_window_id,
            &self.handle,
            docker,
            self.tx.ctx.clone(),
            row.info.id.clone(),
            &row.info.name,
        );
        self.next_window_id += 1;
        self.log_windows.push(window);
    }

    fn table(&self, ui: &mut egui::Ui, actions: &mut Vec<Action>) {
        let mut lines = Vec::new();
        for (ci, c) in self.containers.iter().enumerate() {
            lines.push(Line::Container(ci));
            if c.expanded {
                match &c.procs {
                    None => lines.push(Line::Loading),
                    Some(p) => lines.extend((0..p.len()).map(|pi| Line::Proc(ci, pi))),
                }
            }
        }
        // Parent container index for each line (for selection / context menu).
        let parent = |line: &Line| match line {
            Line::Container(ci) | Line::Proc(ci, _) => *ci,
            Line::Loading => 0,
        };
        let mut parents: Vec<usize> = Vec::with_capacity(lines.len());
        let mut last_container = 0;
        for l in &lines {
            if let Line::Container(ci) = l {
                last_container = *ci;
            }
            parents.push(match l {
                Line::Loading => last_container,
                other => parent(other),
            });
        }

        let right = |ui: &mut egui::Ui, text: &str| {
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                ui.label(text);
            });
        };

        TableBuilder::new(ui)
            .striped(true)
            .resizable(true)
            .sense(egui::Sense::click())
            .cell_layout(Layout::left_to_right(Align::Center))
            .column(Column::initial(320.0).at_least(120.0))
            .column(Column::initial(110.0).at_least(60.0))
            .column(Column::initial(130.0).at_least(60.0))
            .column(Column::initial(90.0).at_least(50.0))
            .column(Column::initial(180.0).at_least(80.0))
            .column(Column::initial(150.0).at_least(80.0))
            .column(Column::initial(80.0).at_least(40.0))
            .column(Column::remainder().at_least(100.0).clip(true))
            .header(26.0, |mut h| {
                for title in [
                    "Container / Process (CMD)", "Container ID", "Status", "CPU %",
                    "Memory Usage", "Net I/O (RX / TX)", "PID", "Ports",
                ] {
                    h.col(|ui| {
                        ui.strong(title);
                    });
                }
            })
            .body(|body| {
                body.rows(30.0, lines.len(), |mut row| {
                    let i = row.index();
                    let c = &self.containers[parents[i]];
                    let is_selected = self.selected.as_deref() == Some(c.info.id.as_str());
                    row.set_selected(is_selected);

                    match &lines[i] {
                        Line::Container(_) => {
                            row.col(|ui| {
                                let arrow = if c.expanded { "▼" } else { "▶" };
                                if ui.small_button(arrow).clicked() {
                                    actions.push(Action::Toggle(c.info.id.clone()));
                                }
                                ui.label(RichText::new(&c.info.name).strong());
                            });
                            row.col(|ui| right_center(ui, &c.info.short_id));
                            row.col(|ui| right_center(ui, &c.info.status));
                            row.col(|ui| right(ui, &c.cpu));
                            row.col(|ui| right(ui, &c.mem));
                            row.col(|ui| right(ui, &c.net));
                            row.col(|ui| right(ui, "--"));
                            row.col(|ui| {
                                ui.label(&c.info.ports);
                            });
                        }
                        Line::Loading => {
                            row.col(|ui| {
                                ui.add_space(24.0);
                                ui.weak("Loading processes...");
                            });
                            for _ in 0..7 {
                                row.col(|_| {});
                            }
                        }
                        Line::Proc(_, pi) => {
                            let p = &c.procs.as_ref().unwrap()[*pi];
                            row.col(|ui| {
                                ui.add_space(24.0);
                                ui.label(format!("⚙ {}", p.command));
                            });
                            row.col(|ui| right_center(ui, "--"));
                            row.col(|ui| right_center(ui, "--"));
                            row.col(|ui| right(ui, &p.cpu));
                            row.col(|ui| right(ui, &p.mem));
                            row.col(|ui| right(ui, "--"));
                            row.col(|ui| right(ui, &p.pid));
                            row.col(|ui| {
                                ui.label("--");
                            });
                        }
                    }

                    let resp = row.response();
                    if resp.double_clicked() {
                        actions.push(Action::Logs(c.info.id.clone()));
                    } else if resp.clicked() || resp.secondary_clicked() {
                        actions.push(Action::Select(c.info.id.clone()));
                    }
                    resp.context_menu(|ui| {
                        if ui.button("View Logs").clicked() {
                            actions.push(Action::Logs(c.info.id.clone()));
                            ui.close_menu();
                        }
                    });
                });
            });
    }
}

fn right_center(ui: &mut egui::Ui, text: &str) {
    ui.with_layout(Layout::centered_and_justified(egui::Direction::LeftToRight), |ui| {
        ui.label(text);
    });
}

impl eframe::App for App {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        self.drain_messages();

        if let Some(err) = &self.fatal {
            egui::CentralPanel::default().show(ctx, |ui| {
                ui.vertical_centered(|ui| {
                    ui.add_space(ui.available_height() / 3.0);
                    ui.heading("Docker Error");
                    ui.add_space(8.0);
                    ui.label(err);
                    ui.add_space(12.0);
                    if ui.button("Quit").clicked() {
                        ctx.send_viewport_cmd(egui::ViewportCommand::Close);
                    }
                });
            });
            return;
        }

        if let Some(err) = self.last_error.clone() {
            let mut dismiss = false;
            egui::TopBottomPanel::bottom("status").show(ctx, |ui| {
                ui.horizontal(|ui| {
                    ui.colored_label(Color32::from_rgb(0xc0, 0x39, 0x2b), err);
                    dismiss = ui.small_button("dismiss").clicked();
                });
            });
            if dismiss {
                self.last_error = None;
            }
        }

        let mut actions = Vec::new();
        egui::CentralPanel::default().show(ctx, |ui| {
            if self.containers.is_empty() {
                ui.weak("No running containers.");
            }
            self.table(ui, &mut actions);
        });

        for action in actions {
            match action {
                Action::Toggle(id) => self.toggle(&id),
                Action::Select(id) => self.selected = Some(id),
                Action::Logs(id) => {
                    self.selected = Some(id.clone());
                    self.open_logs(&id);
                }
            }
        }

        for w in &mut self.log_windows {
            w.show(ctx);
        }
        self.log_windows.retain(|w| w.open); // Drop stops the worker
    }

    fn on_exit(&mut self, _gl: Option<&eframe::glow::Context>) {
        let _ = self.stop.send(true);
        self.log_windows.clear();
        // Don't block shutdown on in-flight Docker requests.
        if let Some(rt) = self.rt.take() {
            rt.shutdown_background();
        }
    }
}

fn main() -> eframe::Result<()> {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(4)
        .enable_all()
        .build()
        .expect("failed to start tokio runtime");

    // Fail early if Docker is unavailable rather than opening a blank UI.
    let docker = rt.block_on(async {
        let docker = Docker::connect_with_defaults()?.with_timeout(DOCKER_TIMEOUT);
        docker.ping().await?;
        Ok::<_, DockerError>(docker)
    });

    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([1280.0, 700.0]),
        ..Default::default()
    };
    eframe::run_native(
        "Docker Container & Process Monitor",
        options,
        Box::new(move |cc| Box::new(App::new(cc, rt, docker))),
    )
}
