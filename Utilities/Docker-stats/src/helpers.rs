use std::collections::HashMap;
use bollard::errors::Error as DockerError;
use chrono::{DateTime, Utc};

pub fn format_bytes(value: u64) -> String {
    let mut value = value as f64;
    for unit in ["B", "KiB", "MiB", "GiB"] {
        if value < 1024.0 {
            return format!("{value:.1}{unit}");
        }
        value /= 1024.0;
    }
    format!("{value:.1}TiB")
}

pub fn format_ports(ports: &HashMap<String, Option<Vec<bollard::models::PortBinding>>>) -> String {
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

pub fn plural(n: i64, unit: &str) -> String {
    format!("{n} {unit}{}", if n == 1 { "" } else { "s" })
}

pub fn format_uptime(started_at: &str) -> String {
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

pub fn capitalize(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        Some(c) => c.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase(),
        None => String::new(),
    }
}

pub fn is_not_found(err: &DockerError) -> bool {
    matches!(
        err,
        DockerError::DockerResponseServerError { status_code: 404, .. }
    )
}

pub fn is_json_error(err: &DockerError) -> bool {
    matches!(
        err,
        DockerError::JsonDataError { .. } | DockerError::JsonSerdeError { .. }
    )
}