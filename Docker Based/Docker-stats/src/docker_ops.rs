use std::collections::{HashMap, HashSet, VecDeque};
use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use bollard::container::{
    ListContainersOptions, LogsOptions, StatsOptions, TopOptions,
};
use bollard::errors::Error as DockerError;
use bollard::Docker;
use eframe::egui::{self, Color32, RichText};
use futures_util::StreamExt;
use tokio::runtime::Handle;
use tokio::sync::{watch, Semaphore};

use crate::helpers::{capitalize, format_ports, format_uptime, is_json_error, is_not_found, format_bytes};

pub const POLL_INTERVAL: Duration = Duration::from_secs(1);
pub const MAX_WORKERS: usize = 8;
pub const LOG_LINE_LIMIT: usize = 20_000;
pub const DOCKER_TIMEOUT: Duration = Duration::from_secs(10);

#[derive(Clone)]
pub struct ContainerInfo {
    pub id: String,
    pub name: String,
    pub short_id: String,
    pub status: String,
    pub ports: String,
}

#[derive(Clone)]
pub struct ProcRow {
    pub command: String,
    pub cpu: String,
    pub mem: String,
    pub pid: String,
    pub status: String,
    pub threads: String,
}

pub enum Msg {
    Snapshot(Vec<ContainerInfo>),
    Stats { id: String, cpu: String, mem: String, net: String },
    Processes { id: String, rows: Vec<ProcRow> },
    Remove(String),
    Error(String),
}

#[derive(Clone)]
pub struct Tx {
    pub tx: Sender<Msg>,
    pub ctx: egui::Context,
}

impl Tx {
    pub fn send(&self, msg: Msg) {
        let _ = self.tx.send(msg);
        self.ctx.request_repaint();
    }
}

#[derive(Clone)]
pub struct Shared {
    pub inflight_stats: Arc<Mutex<HashSet<String>>>,
    pub inflight_procs: Arc<Mutex<HashSet<String>>>,
    pub prev_cpu: Arc<Mutex<HashMap<String, (u64, u64)>>>,
    pub workers: Arc<Semaphore>,
}

impl Shared {
    pub fn new() -> Self {
        Self {
            inflight_stats: Default::default(),
            inflight_procs: Default::default(),
            prev_cpu: Default::default(),
            workers: Arc::new(Semaphore::new(MAX_WORKERS)),
        }
    }
}

pub async fn snapshot(docker: &Docker) -> Result<Vec<ContainerInfo>, DockerError> {
    let list = docker
        .list_containers(Some(ListContainersOptions::<String>::default()))
        .await?;
    let mut out = Vec::with_capacity(list.len());
    for summary in list {
        let Some(id) = summary.id else { continue };
        let inspect = match docker.inspect_container(&id, None).await {
            Ok(i) => i,
            Err(e) if is_not_found(&e) => continue,
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

pub async fn poll_loop(docker: Docker, tx: Tx, shared: Shared, mut stop: watch::Receiver<bool>) {
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

pub async fn fetch_stats(docker: Docker, id: String, tx: Tx, shared: Shared) {
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
        Ok(Some(Err(e))) if is_json_error(&e) => {}
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

pub async fn fetch_processes(docker: Docker, id: String, tx: Tx, shared: Shared) {
    let result = tokio::time::timeout(
        DOCKER_TIMEOUT,
        docker.top_processes(&id, Some(TopOptions { ps_args: "-aux" })),
    )
    .await;

    match result {
        Err(_) => {},
        Ok(Err(_)) => {},
        Ok(Ok(top)) => {
            let titles = top.titles.unwrap_or_default();
            let processes = top.processes.unwrap_or_default();
            let idx = |name: &str| titles.iter().position(|t| t == name);
            let pid_idx = idx("PID").unwrap_or(1);
            let stat_idx = idx("STAT").or_else(|| idx("S"));
            let cpu_idx = idx("%CPU");
            let mem_idx = idx("%MEM");
            let cmd_idx = idx("COMMAND");
            let th_idx = idx("THCNT").or_else(|| idx("NLWP"));

            let rows = processes
                .iter()
                .map(|proc| {
                    let pid = proc.get(pid_idx).cloned().unwrap_or_else(|| "--".into());
                    let status = stat_idx
                        .and_then(|i| proc.get(i))
                        .cloned()
                        .unwrap_or_else(|| "S".into());
                    
                    let thread_count = th_idx
                        .and_then(|i| proc.get(i))
                        .cloned()
                        .unwrap_or_else(|| {
                            if status.contains('l') { "4" } else { "1" }.into()
                        });

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

                    ProcRow {
                        command,
                        cpu: pct(cpu_idx),
                        mem: pct(mem_idx),
                        pid,
                        status,
                        threads: thread_count,
                    }
                })
                .collect();
            tx.send(Msg::Processes { id: id.clone(), rows });
        }
    }
    shared.inflight_procs.lock().unwrap().remove(&id);
}

pub async fn stream_logs(
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

pub struct LogWindow {
    id: u64,
    title: String,
    rx: Receiver<String>,
    lines: VecDeque<String>,
    partial: String,
    stop: watch::Sender<bool>,
    pub open: bool,
}

impl LogWindow {
    pub fn new(
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

    pub fn show(&mut self, ctx: &egui::Context) {
        self.drain();
        let mut open = self.open;
        egui::Window::new(&self.title)
            .id(egui::Id::new(("log-window", self.id)))
            .default_size([900.0, 500.0])
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
                                        .size(12.0)
                                        .color(Color32::BLACK),
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
        let _ = self.stop.send(true);
    }
}