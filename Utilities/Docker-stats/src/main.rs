//! Docker Container & Process Monitor.
//!
//! A modern light-themed GUI monitor for running Docker containers, featuring
//! sidebar navigation and process tree views.

mod helpers;
mod docker_ops;
mod ui;

use bollard::errors::Error as DockerError;
use bollard::Docker;
use ui::App;
use docker_ops::DOCKER_TIMEOUT;
use eframe::egui;

fn main() -> eframe::Result<()> {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(4)
        .enable_all()
        .build()
        .expect("failed to start tokio runtime");

    let docker = rt.block_on(async {
        let docker = Docker::connect_with_defaults()?.with_timeout(DOCKER_TIMEOUT);
        docker.ping().await?;
        Ok::<_, DockerError>(docker)
    });

    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([1280.0, 720.0])
            .with_title("Docker Container & Process Monitor"),
        ..Default::default()
    };
    eframe::run_native(
        "Docker Container & Process Monitor",
        options,
        Box::new(move |cc| Box::new(App::new(cc, rt, docker))),
    )
}