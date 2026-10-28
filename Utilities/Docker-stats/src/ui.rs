use std::collections::{HashSet, VecDeque};
use std::sync::mpsc::channel;

use bollard::errors::Error as DockerError;
use bollard::Docker;
use eframe::egui::{self, Align, Color32, Layout, Margin, RichText, Rounding};
use egui_extras::{Column, TableBuilder};
use egui_plot::{Line as PlotLine, Plot, PlotPoints};
use tokio::runtime::{Handle, Runtime};
use tokio::sync::watch;

use crate::docker_ops::{fetch_processes, poll_loop, ContainerInfo, LogWindow, Msg, ProcRow, Shared, Tx, POLL_INTERVAL};

pub struct ContainerRow {
    pub info: ContainerInfo,
    pub cpu: String,
    pub last_cpu: String,
    pub mem: String,
    pub net: String,
    pub expanded: bool,
    pub procs: Option<Vec<ProcRow>>,
}

pub enum Action {
    Toggle(String),
    Select(String),
    Logs(String),
    Refresh,
}

pub enum TableLine {
    Container(usize),
    Loading,
    Proc(usize, usize),
}

pub struct DataPoint {
    pub time: f64,
    pub value: f64,
}

pub struct App {
    pub rt: Option<Runtime>,
    pub handle: Handle,
    pub docker: Option<Docker>,
    pub fatal: Option<String>,
    pub rx: std::sync::mpsc::Receiver<Msg>,
    pub tx: Tx,
    pub shared: Shared,
    pub stop: watch::Sender<bool>,
    pub containers: Vec<ContainerRow>,
    pub selected: Option<String>,
    pub log_windows: Vec<LogWindow>,
    pub next_window_id: u64,
    pub last_error: Option<String>,
    pub search_filter: String,
    pub active_nav: String,
    pub sidebar_open: bool,
    pub cpu_history: VecDeque<DataPoint>,
    pub mem_history: VecDeque<DataPoint>,
    pub net_rx_history: VecDeque<DataPoint>,
    pub net_tx_history: VecDeque<DataPoint>,
    pub start_time: std::time::Instant,
    pub last_metric_push: std::time::Instant,
}

impl App {
    pub fn new(
        cc: &eframe::CreationContext<'_>,
        rt: Runtime,
        docker: Result<Docker, DockerError>,
    ) -> Self {
        let (tx, rx) = channel();
        let tx = Tx { tx, ctx: cc.egui_ctx.clone() };
        let shared = Shared::new();
        let (stop, stop_rx) = watch::channel(false);
        let handle = rt.handle().clone();

        let mut visuals = egui::Visuals::light();
        visuals.window_fill = Color32::from_rgb(0xf8, 0xf8, 0xf8);
        visuals.panel_fill = Color32::from_rgb(0xeb, 0xeb, 0xeb);
        visuals.faint_bg_color = Color32::from_rgb(0xf5, 0xf5, 0xf5);
        visuals.widgets.noninteractive.bg_fill = Color32::from_rgb(0xeb, 0xeb, 0xeb);
        visuals.widgets.inactive.bg_fill = Color32::from_rgb(0xe0, 0xe0, 0xe0);
        cc.egui_ctx.set_visuals(visuals);
        let last_metric_push = std::time::Instant::now();
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
            search_filter: String::new(),
            active_nav: "Containers".into(),
            cpu_history: VecDeque::with_capacity(120),
            mem_history: VecDeque::with_capacity(120),
            net_rx_history: VecDeque::with_capacity(120),
            net_tx_history: VecDeque::with_capacity(120),
            start_time: std::time::Instant::now(),
            last_metric_push,
            sidebar_open: false,
        }
    }

    pub fn drain_messages(&mut self) {
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
                                cpu: "0.00%".into(),
                                last_cpu: "0.00%".into(),
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
                        row.last_cpu = row.cpu.clone();
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
                    eprintln!("{e}");
                    self.last_error = Some(e);
                }
            }
        }
    }

    pub fn toggle(&mut self, id: &str) {
        let Some(docker) = self.docker.clone() else { return };
        let Some(row) = self.containers.iter_mut().find(|c| c.info.id == id) else { return };
        row.expanded = !row.expanded;
        if !row.expanded {
            return;
        }
        row.procs = None;
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

    pub fn open_logs(&mut self, id: &str) {
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

    pub fn render_sidebar(&mut self, ctx: &egui::Context) {
        egui::SidePanel::left("sidebar")
            .resizable(false)
            .default_width(175.0)
            .frame(
                egui::Frame::none()
                    .fill(Color32::from_rgb(0xeb, 0xeb, 0xeb))
                    .inner_margin(Margin::symmetric(10.0, 12.0)),
            )
            .show(ctx, |ui| {
                ui.spacing_mut().item_spacing.y = 4.0;
                ui.label(RichText::new("Docker Monitor").strong().size(14.0).color(Color32::DARK_GRAY));
                ui.add_space(8.0);
                ui.separator();
                ui.add_space(8.0);

                let nav_items = ["Containers", "Performance", "Graphs", "About"];

                for item in nav_items {
                    let is_active = self.active_nav == item;
                    if is_active {
                        let fill = Color32::from_rgb(0xb2, 0xd7, 0xf7);
                        let text_color = Color32::from_rgb(0x00, 0x33, 0x66);
                        egui::Frame::none()
                            .fill(fill)
                            .rounding(Rounding::same(6.0))
                            .inner_margin(Margin::symmetric(10.0, 6.0))
                            .show(ui, |ui| {
                                ui.set_min_width(ui.available_width());
                                ui.label(RichText::new(item).strong().color(text_color).size(13.0));
                            });
                    } else {
                        ui.add_space(2.0);
                        if ui.selectable_label(false, RichText::new(item).color(Color32::from_rgb(0x40, 0x40, 0x40)).size(12.5)).clicked() {
                            self.active_nav = item.into();
                        }
                    }
                }
            });
    }

    pub fn render_header(&mut self, ctx: &egui::Context, actions: &mut Vec<Action>) {
        egui::TopBottomPanel::top("top_header")
            .frame(
                egui::Frame::none()
                    .fill(Color32::from_rgb(0xf5, 0xf5, 0xf5))
                    .inner_margin(Margin::symmetric(16.0, 8.0)),
            )
            .show(ctx, |ui| {
                ui.horizontal(|ui| {
                    // Hamburger button to toggle the sidebar
                    if ui.button("☰").clicked() {
                        self.sidebar_open = !self.sidebar_open;
                    }
                    ui.add_space(8.0);
                    ui.heading(RichText::new(&self.active_nav).size(18.0).strong());

                    ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                        if ui.button("🔄 Refresh").clicked() {
                            actions.push(Action::Refresh);
                        }
                        ui.add_space(8.0);
                        ui.add(
                            egui::TextEdit::singleline(&mut self.search_filter)
                                .hint_text("Filter containers...")
                                .desired_width(200.0),
                        );
                    });
                });
            });
    }

    pub fn update_global_metrics(&mut self) {
        if self.last_metric_push.elapsed() < POLL_INTERVAL {
            return;
        }
        self.last_metric_push = std::time::Instant::now();

        let elapsed = self.start_time.elapsed().as_secs_f64();
        
        let mut total_cpu = 0.0;
        let mut total_mem_mib = 0.0;
        let mut total_rx_bytes = 0.0;
        let mut total_tx_bytes = 0.0;
        
        for c in &self.containers {
            let cpu_val = c.cpu.trim_end_matches('%').parse::<f64>().unwrap_or(0.0);
            total_cpu += cpu_val;
            
            if let Some(part) = c.mem.split(" MiB").next() {
                let mem_val = part.trim().parse::<f64>().unwrap_or(0.0);
                total_mem_mib += mem_val;
            }

            let net_parts: Vec<&str> = c.net.split(" / ").collect();
            if net_parts.len() == 2 {
                total_rx_bytes += self.parse_bytes_to_f64(net_parts[0]);
                total_tx_bytes += self.parse_bytes_to_f64(net_parts[1]);
            }
        }

        let push_capped = |buf: &mut VecDeque<DataPoint>, val: f64| {
            buf.push_back(DataPoint { time: elapsed, value: val });
            if buf.len() > 120 {
                buf.pop_front();
            }
        };

        push_capped(&mut self.cpu_history, total_cpu);
        push_capped(&mut self.mem_history, total_mem_mib);
        push_capped(&mut self.net_rx_history, total_rx_bytes);
        push_capped(&mut self.net_tx_history, total_tx_bytes);
    }

    pub fn parse_bytes_to_f64(&self, s: &str) -> f64 {
        let s = s.trim();
        let multiplier = if s.ends_with("KiB") {
            1024.0
        } else if s.ends_with("MiB") {
            1024.0 * 1024.0
        } else if s.ends_with("GiB") {
            1024.0 * 1024.0 * 1024.0
        } else {
            1.0
        };
        
        let num_str: String = s.chars().take_while(|c| c.is_ascii_digit() || *c == '.').collect();
        num_str.parse::<f64>().unwrap_or(0.0) * multiplier
    }

    pub fn render_table(&self, ui: &mut egui::Ui, actions: &mut Vec<Action>) {
        let mut lines = Vec::new();
        for (ci, c) in self.containers.iter().enumerate() {
            if !self.search_filter.is_empty()
                && !c.info.name.to_lowercase().contains(&self.search_filter.to_lowercase())
                && !c.info.short_id.contains(&self.search_filter)
            {
                continue;
            }

            lines.push(TableLine::Container(ci));
            if c.expanded {
                match &c.procs {
                    None => lines.push(TableLine::Loading),
                    Some(p) => lines.extend((0..p.len()).map(|pi| TableLine::Proc(ci, pi))),
                }
            }
        }

        let parent = |line: &TableLine| match line {
            TableLine::Container(ci) | TableLine::Proc(ci, _) => *ci,
            TableLine::Loading => 0,
        };
        let mut parents: Vec<usize> = Vec::with_capacity(lines.len());
        let mut last_container = 0;
        for l in &lines {
            if let TableLine::Container(ci) = l {
                last_container = *ci;
            }
            parents.push(match l {
                TableLine::Loading => last_container,
                other => parent(other),
            });
        }

        let right = |ui: &mut egui::Ui, text: &str| {
            ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                ui.label(RichText::new(text).size(12.0).color(Color32::BLACK));
            });
        };

        let available_height = ui.available_height();

        TableBuilder::new(ui)
            .max_scroll_height(available_height)
            .striped(true)
            .resizable(true)
            .sense(egui::Sense::click())
            .cell_layout(Layout::left_to_right(Align::Center))
            .column(Column::initial(300.0).at_least(120.0).at_most(350.0).clip(true))
            .column(Column::initial(110.0).at_least(60.0))
            .column(Column::initial(130.0).at_least(60.0))
            .column(Column::initial(80.0).at_least(50.0))
            .column(Column::initial(160.0).at_least(80.0))
            .column(Column::initial(140.0).at_least(80.0))
            .column(Column::initial(70.0).at_least(40.0))
            .column(Column::remainder().at_least(100.0).clip(true))
            .header(28.0, |mut h| {
                for title in [
                    "Container / Process (CMD)", "Container ID", "Status", "CPU %",
                    "Memory Usage", "Net I/O (RX / TX)", "PID", "Ports",
                ] {
                    h.col(|ui| {
                        ui.label(RichText::new(title).strong().size(12.0).color(Color32::DARK_GRAY));
                    });
                }
            })
            .body(|body| {
                body.rows(26.0, lines.len(), |mut row| {
                    let i = row.index();
                    let c = &self.containers[parents[i]];
                    let is_selected = self.selected.as_deref() == Some(c.info.id.as_str());
                    row.set_selected(is_selected);

                    match &lines[i] {
                        TableLine::Container(_) => {
                            row.col(|ui| {
                                let arrow = if c.expanded { "▼" } else { "▶" };
                                if ui.small_button(arrow).clicked() {
                                    actions.push(Action::Toggle(c.info.id.clone()));
                                }
                                ui.label(RichText::new(&c.info.name).strong().size(12.0).color(Color32::BLACK));
                            });
                            row.col(|ui| right_center(ui, &c.info.short_id));
                            row.col(|ui| right_center(ui, &c.info.status));                          
                            row.col(|ui| {
                                if c.cpu != c.last_cpu {
                                    let rect = ui.available_rect_before_wrap();
                                    ui.painter().rect_filled(
                                        rect,
                                        Rounding::same(3.0),
                                        Color32::from_rgb(200, 240, 200),
                                    );
                                }
                                right(ui, &c.cpu);
                            });
                            row.col(|ui| right(ui, &c.mem));
                            row.col(|ui| right(ui, &c.net));
                            row.col(|ui| right_center(ui, "--"));
                            row.col(|ui| {
                                ui.label(RichText::new(&c.info.ports).size(12.0).color(Color32::BLACK));
                            });
                        }
                        TableLine::Loading => {
                            row.col(|ui| {
                                ui.add_space(24.0);
                                ui.weak("Loading processes...");
                            });
                            for _ in 0..7 {
                                row.col(|_| {});
                            }
                        }
                        TableLine::Proc(_, pi) => {
                            let p = &c.procs.as_ref().unwrap()[*pi];
                            row.col(|ui| {
                                ui.add_space(20.0);
                                ui.label(
                                    RichText::new(format!("⚙ {}", p.command))
                                        .size(12.0)
                                        .color(Color32::DARK_GRAY)
                                )
                                .on_hover_text(&p.command);
                            });
                            row.col(|ui| right_center(ui, "--"));
                            row.col(|ui| {
                                ui.with_layout(Layout::centered_and_justified(egui::Direction::LeftToRight), |ui| {
                                    ui.label(RichText::new(&p.status).size(12.0).color(Color32::BLACK))
                                        .on_hover_text(decode_process_status(&p.status));
                                });
                            });
                            row.col(|ui| right(ui, &p.cpu));
                            row.col(|ui| right(ui, &p.mem));
                            row.col(|ui| right(ui, "--"));
                            
                            row.col(|ui| {
                               ui.with_layout(Layout::centered_and_justified(egui::Direction::LeftToRight), |ui| {
                                    ui.label(RichText::new(&p.pid).size(12.0).color(Color32::BLACK))
                                        .on_hover_text(format!("Threads: {}", p.threads));
                                });
                            });

                            row.col(|ui| {
                                ui.label(RichText::new("--").size(12.0).color(Color32::DARK_GRAY));
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

pub fn right_center(ui: &mut egui::Ui, text: &str) {
    ui.with_layout(Layout::centered_and_justified(egui::Direction::LeftToRight), |ui| {
        ui.label(RichText::new(text).size(12.0).color(Color32::BLACK));
    });
}

pub fn decode_process_status(status: &str) -> String {
    let mut explanations = Vec::new();
    for ch in status.chars() {
        match ch {
            'R' => explanations.push("• R: Running or runnable (on run queue)"),
            'S' => explanations.push("• S: Interruptible sleep (waiting for an event)"),
            'D' => explanations.push("• D: Uninterruptible sleep (usually disk I/O)"),
            'Z' => explanations.push("• Z: Zombie (terminated process)"),
            'T' => explanations.push("• T: Stopped (by signal or trace)"),
            's' => explanations.push("• s: Session leader (controls process group)"),
            'l' => explanations.push("• l: Multi-threaded (uses multiple threads)"),
            'L' => explanations.push("• L: Pages locked into memory"),
            'N' => explanations.push("• N: Low-priority (nice)"),
            '<' => explanations.push("• <: High-priority"),
            _ => {}
        }
    }
    if explanations.is_empty() {
        format!("Status Code: {}", status)
    } else {
        explanations.join("\n")
    }
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

        // 1. Conditionally render the sidebar based on the hamburger toggle (defaults to closed)
        if self.sidebar_open {
            self.render_sidebar(ctx);
        }
        
        // 2. Render the top header only ONCE
        self.render_header(ctx, &mut actions);

        egui::CentralPanel::default().show(ctx, |ui| {
            if self.active_nav == "Containers" {
                if self.containers.is_empty() {
                    ui.weak("No running containers.");
                } else {
                    self.render_table(ui, &mut actions);
                }
            } else if self.active_nav == "Graphs" {
                self.update_global_metrics();

                let total_available = ui.available_height();
                let dynamic_chart_height = ((total_available - 160.0) / 4.0).max(100.0);

                egui::ScrollArea::vertical().show(ui, |ui| {
                    ui.heading("Global Docker Telemetry");
                    ui.add_space(8.0);

                    // 1. Total CPU Usage Chart
                    ui.label(RichText::new("Total CPU Usage (%)").strong().size(13.0));
                    let cpu_points: PlotPoints = self.cpu_history
                        .iter()
                        .map(|p| [p.time, p.value])
                        .collect();
                    
                    Plot::new("total_cpu_plot")
                        .height(dynamic_chart_height)
                        .include_y(0.0)
                        .show(ui, |plot_ui| {
                            plot_ui.line(PlotLine::new(cpu_points).color(Color32::from_rgb(46, 204, 113)).name("CPU %"));
                        });

                    ui.add_space(10.0);

                    // 2. Total Memory Usage Chart
                    ui.label(RichText::new("Total Memory Usage (MiB)").strong().size(13.0));
                    let mem_points: PlotPoints = self.mem_history
                        .iter()
                        .map(|p| [p.time, p.value])
                        .collect();

                    Plot::new("total_mem_plot")
                        .height(dynamic_chart_height)
                        .include_y(0.0)
                        .show(ui, |plot_ui| {
                            plot_ui.line(PlotLine::new(mem_points).color(Color32::from_rgb(52, 152, 219)).name("Memory MiB"));
                        });

                    ui.add_space(10.0);

                    // 3. Network RX Chart
                    ui.label(RichText::new("Network RX (Receive) [Bytes]").strong().size(13.0));
                    let rx_points: PlotPoints = self.net_rx_history
                        .iter()
                        .map(|p| [p.time, p.value])
                        .collect();

                    Plot::new("total_net_rx_plot")
                        .height(dynamic_chart_height)
                        .include_y(0.0)
                        .show(ui, |plot_ui| {
                            plot_ui.line(PlotLine::new(rx_points).color(Color32::from_rgb(41, 128, 185)).name("RX Bytes"));
                        });

                    ui.add_space(10.0);

                    // 4. Network TX Chart
                    ui.label(RichText::new("Network TX (Transmit) [Bytes]").strong().size(13.0));
                    let tx_points: PlotPoints = self.net_tx_history
                        .iter()
                        .map(|p| [p.time, p.value])
                        .collect();

                    Plot::new("total_net_tx_plot")
                        .height(dynamic_chart_height)
                        .include_y(0.0)
                        .show(ui, |plot_ui| {
                            plot_ui.line(PlotLine::new(tx_points).color(Color32::from_rgb(230, 126, 34)).name("TX Bytes"));
                        });
                });
            } else if self.active_nav == "Performance" {
                // Automatically fetch processes for running containers if not loaded yet
                if let Some(docker) = self.docker.clone() {
                    for c in &mut self.containers {
                        if c.procs.is_none() && c.info.status.to_lowercase().starts_with("up") {
                            let id = c.info.id.clone();
                            let newly_inserted = self.shared.inflight_procs.lock().unwrap().insert(id.clone());
                            if newly_inserted {
                                self.handle.spawn(crate::docker_ops::fetch_processes(
                                    docker.clone(),
                                    id,
                                    self.tx.clone(),
                                    self.shared.clone(),
                                ));
                            }
                        }
                    }
                }

                let mut total_cpu = 0.0;
                let mut total_mem_mib = 0.0;
                let mut running_count = 0;
                let mut stopped_count = 0;
                let mut total_processes = 0;
                let mut total_threads = 0;

                for c in &self.containers {
                    let cpu_val = c.cpu.trim_end_matches('%').parse::<f64>().unwrap_or(0.0);
                    total_cpu += cpu_val;
                    
                    if let Some(part) = c.mem.split(" MiB").next() {
                        let mem_val = part.trim().parse::<f64>().unwrap_or(0.0);
                        total_mem_mib += mem_val;
                    }

                    if c.info.status.to_lowercase().starts_with("up") {
                        running_count += 1;
                    } else {
                        stopped_count += 1;
                    }

                    if let Some(ref procs) = c.procs {
                        total_processes += procs.len();
                        for p in procs {
                            total_threads += p.threads.parse::<usize>().unwrap_or(1);
                        }
                    }
                }

                let mut cpu_indices: Vec<usize> = (0..self.containers.len()).collect();
                cpu_indices.sort_by(|&a, &b| {
                    let a_val = self.containers[a].cpu.trim_end_matches('%').parse::<f64>().unwrap_or(0.0);
                    let b_val = self.containers[b].cpu.trim_end_matches('%').parse::<f64>().unwrap_or(0.0);
                    b_val.partial_cmp(&a_val).unwrap_or(std::cmp::Ordering::Equal)
                });

                let mut mem_indices: Vec<usize> = (0..self.containers.len()).collect();
                mem_indices.sort_by(|&a, &b| {
                    let parse_mem = |s: &str| {
                        s.split(" MiB").next().and_then(|p| p.trim().parse::<f64>().ok()).unwrap_or(0.0)
                    };
                    let a_val = parse_mem(&self.containers[a].mem);
                    let b_val = parse_mem(&self.containers[b].mem);
                    b_val.partial_cmp(&a_val).unwrap_or(std::cmp::Ordering::Equal)
                });

                egui::ScrollArea::vertical().show(ui, |ui| {
                    ui.heading("System & Container Performance Overview");
                    ui.add_space(12.0);

                    // Top Summary Cards Grid
                    ui.horizontal(|ui| {
                        ui.group(|ui| {
                            ui.set_min_size(egui::vec2(230.0, 75.0));
                            ui.label(RichText::new("Containers & Processes").strong().size(12.0));
                            ui.add_space(4.0);
                            ui.label(RichText::new(format!("{running_count} Active / {stopped_count} Stopped")).size(13.0).color(Color32::from_rgb(46, 204, 113)));
                            ui.label(RichText::new(format!("{total_processes} Processes | {total_threads} Threads")).size(12.0).color(Color32::DARK_GRAY));
                        });
                        ui.add_space(8.0);
                        ui.group(|ui| {
                            ui.set_min_size(egui::vec2(210.0, 75.0));
                            ui.label(RichText::new("Total CPU Utilization").strong().size(12.0));
                            ui.add_space(4.0);
                            ui.label(RichText::new(format!("{total_cpu:.2}% (of 2000%)")).size(14.0).color(Color32::from_rgb(52, 152, 219)));
                        });
                        ui.add_space(8.0);
                        ui.group(|ui| {
                            ui.set_min_size(egui::vec2(210.0, 75.0));
                            ui.label(RichText::new("Total Memory Allocated").strong().size(12.0));
                            ui.add_space(4.0);
                            ui.label(RichText::new(format!("{total_mem_mib:.1} MiB")).size(14.0).color(Color32::from_rgb(230, 126, 34)));
                        });
                    });

                    ui.add_space(24.0);
                    ui.separator();
                    ui.add_space(16.0);

                    // Side-by-Side Leaderboards
                    ui.columns(2, |columns| {
                        columns[0].vertical(|ui| {
                            ui.heading(RichText::new("🔥 Top CPU Consumers").size(15.0));
                            ui.add_space(8.0);
                            if cpu_indices.is_empty() {
                                ui.weak("No containers running.");
                            } else {
                                for &idx in cpu_indices.iter().take(5) {
                                    let c = &self.containers[idx];
                                    ui.horizontal(|ui| {
                                        ui.label(RichText::new(&c.info.name).strong().size(12.0));
                                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                            ui.label(RichText::new(&c.cpu).color(Color32::from_rgb(46, 204, 113)).size(12.0));
                                        });
                                    });
                                    ui.add_space(4.0);
                                }
                            }
                        });

                        columns[1].vertical(|ui| {
                            ui.heading(RichText::new("💾 Top Memory Consumers").size(15.0));
                            ui.add_space(8.0);
                            if mem_indices.is_empty() {
                                ui.weak("No containers running.");
                            } else {
                                for &idx in mem_indices.iter().take(5) {
                                    let c = &self.containers[idx];
                                    ui.horizontal(|ui| {
                                        ui.label(RichText::new(&c.info.name).strong().size(12.0));
                                        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                                            ui.label(RichText::new(&c.mem).color(Color32::from_rgb(52, 152, 219)).size(12.0));
                                        });
                                    });
                                    ui.add_space(4.0);
                                }
                            }
                        });
                    });
                });
            } else if self.active_nav == "About" {
                ui.vertical_centered(|ui| {
                    ui.add_space(ui.available_height() / 4.0);
                    
                    ui.heading(RichText::new("Docker Container & Process Monitor").strong().size(20.0));
                    ui.add_space(8.0);
                    ui.label(
                        RichText::new(
                            "A modern, lightweight desktop application designed for real-time \n\
                             monitoring of running Docker containers, system resource usage, \n\
                             live process trees, and streaming container logs."
                        )
                        .size(13.0)
                        .color(Color32::DARK_GRAY)
                    );

                    ui.add_space(24.0);
                    ui.separator();
                    ui.add_space(24.0);

                    ui.label(RichText::new("Version 1.1.0").strong().size(13.0));
                    ui.add_space(4.0);
                    ui.label(RichText::new("© 2026 DJ Bristow. All rights reserved.").size(12.0).color(Color32::GRAY));
                });
            } else {
                ui.vertical_centered(|ui| {
                    ui.add_space(ui.available_height() / 3.0);
                    ui.heading(format!("{} Panel", self.active_nav));
                    ui.add_space(8.0);
                    ui.weak("Graphs, speedometers, and custom telemetry views can be placed here.");
                });
            }
        });

        for action in actions {
            match action {
                Action::Toggle(id) => self.toggle(&id),
                Action::Select(id) => self.selected = Some(id),
                Action::Logs(id) => {
                    self.selected = Some(id.clone());
                    self.open_logs(&id);
                }
                Action::Refresh => {
                    if let Some(docker) = self.docker.clone() {
                        let tx = self.tx.clone();
                        self.handle.spawn(async move {
                            if let Ok(snap) = crate::docker_ops::snapshot(&docker).await {
                                tx.send(crate::docker_ops::Msg::Snapshot(snap));
                            }
                        });
                    }
                }
            }
        }

        for w in &mut self.log_windows {
            w.show(ctx);
        }
        self.log_windows.retain(|w| w.open);
    }

    fn on_exit(&mut self, _gl: Option<&eframe::glow::Context>) {
        let _ = self.stop.send(true);
        self.log_windows.clear();
        if let Some(rt) = self.rt.take() {
            rt.shutdown_background();
        }
    }
}