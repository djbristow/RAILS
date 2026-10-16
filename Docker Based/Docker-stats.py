#!/usr/bin/env python3
"""Docker Container & Process Monitor.

A Tkinter monitor for running Docker containers. Docker API calls run in
background workers; all Tkinter widget access stays on the Tk main thread.
"""

import queue
import json
import threading
import time
import tkinter as tk
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from tkinter import messagebox, ttk

import docker

POLL_INTERVAL_SECONDS = 2.0
UI_POLL_INTERVAL_MS = 100
MAX_WORKERS = 8
LOG_BATCH_LIMIT = 500


class LogViewerWindow:
    """A log window whose worker communicates with Tk through a queue."""

    def __init__(self, parent, docker_client, container_id, container_name):
        self.top = tk.Toplevel(parent)
        self.top.title(f"Logs: {container_name} ({container_id[:12]})")
        self.top.geometry("900x500")

        self.docker_client = docker_client
        self.container_id = container_id
        self.stop_event = threading.Event()
        self.log_queue = queue.Queue()
        self.closed = False
        self.log_stream = None
        self.log_response = None

        self.text_area = tk.Text(
            self.top,
            bg="#1e1e1e",
            fg="#d4d4d4",
            insertbackground="white",
            font=("Monospace", 9),
            wrap=tk.WORD,
        )
        self.scrollbar = ttk.Scrollbar(
            self.top, orient=tk.VERTICAL, command=self.text_area.yview
        )
        self.text_area.configure(yscrollcommand=self.scrollbar.set)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.text_area.pack(fill=tk.BOTH, expand=True)
        self.top.protocol("WM_DELETE_WINDOW", self.on_close)

        self.log_thread = threading.Thread(
            target=self.stream_logs,
            name=f"docker-logs-{container_id[:12]}",
            daemon=True,
        )
        self.log_thread.start()
        self.top.after(UI_POLL_INTERVAL_MS, self.drain_log_queue)

    def stream_logs(self):
        """Read logs in a daemon thread; reconnect after transient read timeouts."""
        first_connection = True
        while not self.stop_event.is_set():
            stream = None
            try:
                container = self.docker_client.containers.get(self.container_id)
                # The Docker client has a finite request timeout. Reconnect with
                # tail=0 after the initial history to avoid repeating old entries.
                stream = container.logs(
                    stream=True,
                    follow=True,
                    tail=200 if first_connection else 0,
                    timestamps=True,
                )
                self.log_stream = stream
                first_connection = False
                for line in stream:
                    if self.stop_event.is_set():
                        break
                    self.log_queue.put(line.decode("utf-8", errors="replace"))
                if not self.stop_event.is_set():
                    self.log_queue.put("\n--- Log stream ended; reconnecting ---\n")
            except docker.errors.NotFound:
                if not self.stop_event.is_set():
                    self.log_queue.put("\n--- Container was stopped or removed ---\n")
                return
            except Exception as exc:
                if not self.stop_event.is_set():
                    self.log_queue.put(f"\n--- Log stream interrupted ({exc}); reconnecting ---\n")
            finally:
                if stream is not None:
                    try:
                        stream.close()
                    except Exception:
                        pass
            if not self.stop_event.wait(2):
                continue

    def drain_log_queue(self):
        """Batch queued log text on the Tk thread."""
        if self.closed or not self.top.winfo_exists():
            return

        chunks = []
        try:
            while len(chunks) < LOG_BATCH_LIMIT:
                chunks.append(self.log_queue.get_nowait())
        except queue.Empty:
            pass

        if chunks:
            self.text_area.insert(tk.END, "".join(chunks))
            self.text_area.see(tk.END)
        self.top.after(UI_POLL_INTERVAL_MS, self.drain_log_queue)

    def on_close(self):
        if self.closed:
            return
        self.closed = True
        self.stop_event.set()
        # Do not join here: a Docker log iterator can be blocked waiting for
        # the next line. The daemon worker closes its iterator in finally.
        self.top.destroy()


class DockerMonitorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Docker Container & Process Monitor")
        self.root.geometry("1280x700")

        self.running = True
        self.closing = False
        self.stop_event = threading.Event()
        self.ui_queue = queue.Queue()
        self.inflight_stats = set()
        self.inflight_processes = set()
        self.inflight_lock = threading.Lock()
        self.container_nodes = {}  # full container ID -> Treeview item ID
        self.prev_cpu_stats = {}  # full container ID -> (CPU total, system total)
        self.log_windows = []

        try:
            self.docker_client = docker.from_env(timeout=10)
            # Fail early if Docker is unavailable rather than opening a blank UI.
            self.docker_client.ping()
        except Exception as exc:
            messagebox.showerror(
                "Docker Error", f"Could not connect to Docker Engine:\n{exc}"
            )
            try:
                self.root.destroy()
            except tk.TclError:
                pass
            return

        self.style = ttk.Style()
        try:
            self.style.theme_use("clam")
        except tk.TclError:
            pass
        self.style.configure(
            "Treeview", font=("Liberation Sans", 10), rowheight=32,
            fieldbackground="#ffffff"
        )
        self.style.configure(
            "Treeview.Heading", font=("Liberation Sans", 10, "bold"),
            background="#e1e1e1", relief="flat"
        )

        columns = ("cid", "status", "cpu", "mem", "net", "pid", "ports")
        self.tree = ttk.Treeview(self.root, columns=columns)
        self.tree.heading("#0", text="Container / Process (CMD)", anchor=tk.W)
        self.tree.heading("cid", text="Container ID", anchor=tk.CENTER)
        self.tree.heading("status", text="Status", anchor=tk.CENTER)
        self.tree.heading("cpu", text="CPU %", anchor=tk.E)
        self.tree.heading("mem", text="Memory Usage", anchor=tk.E)
        self.tree.heading("net", text="Net I/O (RX / TX)", anchor=tk.E)
        self.tree.heading("pid", text="PID", anchor=tk.E)
        self.tree.heading("ports", text="Ports", anchor=tk.W)
        self.tree.column("#0", width=320)
        self.tree.column("cid", width=110, anchor=tk.CENTER)
        self.tree.column("status", width=130, anchor=tk.CENTER)
        self.tree.column("cpu", width=90, anchor=tk.E)
        self.tree.column("mem", width=180, anchor=tk.E)
        self.tree.column("net", width=150, anchor=tk.E)
        self.tree.column("pid", width=80, anchor=tk.E)
        self.tree.column("ports", width=250, anchor=tk.W)

        scrollbar = ttk.Scrollbar(self.root, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.tree.bind("<<TreeviewOpen>>", self.on_item_expand)
        self.tree.bind("<Double-1>", self.on_double_click)
        self.tree.bind("<Button-3>", self.show_context_menu)

        self.context_menu = tk.Menu(self.root, tearoff=0)
        self.context_menu.add_command(label="View Logs", command=self.open_selected_logs)
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

        self.executor = ThreadPoolExecutor(
            max_workers=MAX_WORKERS, thread_name_prefix="docker-monitor"
        )
        self.poll_thread = threading.Thread(
            target=self.poll_stats_loop, name="docker-poller", daemon=True
        )
        self.poll_thread.start()
        self.root.after(UI_POLL_INTERVAL_MS, self.process_ui_queue)

    @staticmethod
    def format_bytes(value):
        value = max(0, value)
        for unit in ("B", "KiB", "MiB", "GiB"):
            if value < 1024.0:
                return f"{value:.1f}{unit}"
            value /= 1024.0
        return f"{value:.1f}TiB"

    @staticmethod
    def format_ports(ports_dict):
        if not ports_dict:
            return "--"
        mappings = []
        for container_port, host_bindings in ports_dict.items():
            host_ports = []
            for binding in host_bindings or []:
                host_port = binding.get("HostPort")
                if host_port:
                    host_ports.append(host_port)
            if host_ports:
                mappings.append(f"{','.join(host_ports)}->{container_port}")
            else:
                mappings.append(container_port)
        return ", ".join(mappings) if mappings else "--"

    @staticmethod
    def format_uptime(started_at_str):
        if not started_at_str or started_at_str.startswith("0001-"):
            return "unknown"
        try:
            start_dt = datetime.fromisoformat(started_at_str.replace("Z", "+00:00"))
            if start_dt.tzinfo is None:
                start_dt = start_dt.replace(tzinfo=timezone.utc)
            seconds = max(0, int((datetime.now(timezone.utc) - start_dt).total_seconds()))
            if seconds < 60:
                return f"{seconds} seconds"
            if seconds < 3600:
                minutes = seconds // 60
                return f"{minutes} minute{'s' if minutes != 1 else ''}"
            if seconds < 86400:
                hours = seconds // 3600
                return f"{hours} hour{'s' if hours != 1 else ''}"
            days = seconds // 86400
            return f"{days} day{'s' if days != 1 else ''}"
        except (TypeError, ValueError, OverflowError):
            return "unknown"

    def poll_stats_loop(self):
        """Background coordinator: Docker discovery only; Tk calls are forbidden."""
        while not self.stop_event.is_set():
            try:
                containers = self.docker_client.containers.list()
                snapshot = []
                ids = set()
                for container in containers:
                    ids.add(container.id)
                    state = container.attrs.get("State", {})
                    raw_status = state.get("Status", "unknown").capitalize()
                    started_at = state.get("StartedAt", "")
                    uptime = self.format_uptime(started_at)
                    status = f"Up {uptime}" if raw_status.lower() == "running" else raw_status
                    snapshot.append({
                        "id": container.id,
                        "name": container.name,
                        "short_id": container.short_id,
                        "status": status,
                        "ports": self.format_ports(container.ports),
                    })
                self.ui_queue.put(("snapshot", snapshot, ids))
            except Exception as exc:
                if not self.stop_event.is_set():
                    self.ui_queue.put(("error", f"Error scanning Docker containers: {exc}"))
            self.stop_event.wait(POLL_INTERVAL_SECONDS)

    def _add_container_to_tree(self, info):
        cid = info["id"]
        if cid in self.container_nodes or self.closing:
            return
        values = (
            info["short_id"], info["status"], "--", "Loading...", "--", "--", info["ports"]
        )
        node = self.tree.insert("", tk.END, text=f"📦 {info['name']}", values=values)
        self.tree.insert(node, tk.END, text="Expand to load processes")
        self.container_nodes[cid] = node

    def remove_container_node(self, container_id):
        node = self.container_nodes.pop(container_id, None)
        self.prev_cpu_stats.pop(container_id, None)
        with self.inflight_lock:
            self.inflight_stats.discard(container_id)
            self.inflight_processes.discard(container_id)
        if node and self.tree.exists(node):
            self.tree.delete(node)

    def fetch_stats(self, container_id, node_id):
        """Worker: fetch one stats sample and queue the result for Tk."""
        try:
            container = self.docker_client.containers.get(container_id)
            stats = container.stats(stream=False)
            state = container.attrs.get("State", {})
            raw_status = state.get("Status", "unknown").capitalize()
            uptime = self.format_uptime(state.get("StartedAt", ""))
            status = f"Up {uptime}" if raw_status.lower() == "running" else raw_status

            cpu_stats = stats.get("cpu_stats", {})
            precpu_stats = stats.get("precpu_stats", {})
            cpu_total = cpu_stats.get("cpu_usage", {}).get("total_usage", 0)
            system_total = cpu_stats.get("system_cpu_usage", 0)
            previous_cpu, previous_system = self.prev_cpu_stats.get(container_id, (0, 0))
            # Docker's precpu_stats is the previous sample used for this calculation.
            docker_previous_cpu = precpu_stats.get("cpu_usage", {}).get("total_usage", 0)
            docker_previous_system = precpu_stats.get("system_cpu_usage", 0)
            if docker_previous_cpu and docker_previous_system:
                previous_cpu, previous_system = docker_previous_cpu, docker_previous_system
            cpu_delta = cpu_total - previous_cpu
            system_delta = system_total - previous_system
            online_cpus = cpu_stats.get("online_cpus") or len(
                cpu_stats.get("cpu_usage", {}).get("percpu_usage", [])
            ) or 1
            cpu_percent = (
                max(0.0, cpu_delta / system_delta * online_cpus * 100.0)
                if cpu_delta > 0 and system_delta > 0 else 0.0
            )

            memory = stats.get("memory_stats", {})
            mem_usage = memory.get("usage", 0) / (1024 * 1024)
            mem_limit = memory.get("limit", 0) / (1024 * 1024)
            mem_text = f"{mem_usage:.1f} MiB / {mem_limit:.0f} MiB"
            networks = stats.get("networks") or {}
            rx_bytes = sum(net.get("rx_bytes", 0) for net in networks.values())
            tx_bytes = sum(net.get("tx_bytes", 0) for net in networks.values())
            net_text = f"{self.format_bytes(rx_bytes)} / {self.format_bytes(tx_bytes)}"

            self.ui_queue.put((
                "stats", container_id, node_id, status, f"{cpu_percent:.2f}%",
                mem_text, net_text, (cpu_total, system_total)
            ))
        except docker.errors.NotFound:
            self.ui_queue.put(("remove", container_id))

        except json.JSONDecodeError:
            # Docker returned an empty or invalid JSON response.
            # This can occur while containers are stopping or restarting.
            # Skip this sample; the next polling cycle will retry.
            pass

        except Exception as exc:
            if self.running:
                self.ui_queue.put(
                    ("console_error", f"Error updating {container_id[:12]}: {exc}")
                )

        finally:
            with self.inflight_lock:
                self.inflight.discard(container_id)

    def fetch_processes(self, container_id, node_id):
        """Worker: retrieve a container's process list without freezing Tk."""
        try:
            container = self.docker_client.containers.get(container_id)
            data = container.top(ps_args="-aux")
            titles = data.get("Titles", [])
            processes = data.get("Processes", [])
            pid_idx = titles.index("PID") if "PID" in titles else 1
            cpu_idx = titles.index("%CPU") if "%CPU" in titles else -1
            mem_idx = titles.index("%MEM") if "%MEM" in titles else -1
            cmd_idx = titles.index("COMMAND") if "COMMAND" in titles else -1
            rows = []
            for proc in processes:
                pid = proc[pid_idx] if 0 <= pid_idx < len(proc) else "--"
                cpu = f"{proc[cpu_idx]}%" if 0 <= cpu_idx < len(proc) else "--"
                mem = f"{proc[mem_idx]}%" if 0 <= mem_idx < len(proc) else "--"
                command = proc[cmd_idx] if 0 <= cmd_idx < len(proc) else (proc[-1] if proc else "--")
                rows.append((f"⚙️ {command}", ("--", "--", cpu, mem, "--", pid, "--")))
            self.ui_queue.put(("processes", container_id, node_id, rows))
        except docker.errors.NotFound:
            self.ui_queue.put(("remove", container_id))
        except Exception as exc:
            if not self.stop_event.is_set():
                self.ui_queue.put(("error", f"Error fetching processes for {container_id[:12]}: {exc}"))
        finally:
            with self.inflight_lock:
                self.inflight_processes.discard(container_id)

    def process_ui_queue(self):
        """Apply worker results to Tk widgets; this method runs only on Tk's thread."""
        if self.closing:
            return
        try:
            while True:
                item = self.ui_queue.get_nowait()
                kind = item[0]
                if kind == "snapshot":
                    _, snapshot, current_ids = item
                    for cid in list(self.container_nodes):
                        if cid not in current_ids:
                            self.remove_container_node(cid)
                    for info in snapshot:
                        cid = info["id"]
                        if cid not in self.container_nodes:
                            self._add_container_to_tree(info)
                        node_id = self.container_nodes.get(cid)
                        if not node_id:
                            continue
                        with self.inflight_lock:
                            submit = cid not in self.inflight_stats
                            if submit:
                                self.inflight_stats.add(cid)
                        if submit:
                            self.executor.submit(self.fetch_stats, cid, node_id)
                        # Keep status and ports fresh even if stats call is still running.
                        values = list(self.tree.item(node_id, "values"))
                        values[1] = info["status"]
                        values[6] = info["ports"]
                        self.tree.item(node_id, values=values)
                elif kind == "stats":
                    _, cid, node_id, status, cpu, mem, net, cpu_sample = item
                    if cid in self.container_nodes and self.tree.exists(node_id):
                        self.prev_cpu_stats[cid] = cpu_sample
                        values = list(self.tree.item(node_id, "values"))
                        values[1:5] = [status, cpu, mem, net]
                        self.tree.item(node_id, values=values)
                elif kind == "processes":
                    _, cid, node_id, rows = item
                    if cid in self.container_nodes and self.tree.exists(node_id):
                        for child in self.tree.get_children(node_id):
                            self.tree.delete(child)
                        for label, values in rows:
                            self.tree.insert(node_id, tk.END, text=label, values=values)
                elif kind == "remove":
                    self.remove_container_node(item[1])
                elif kind == "error":
                    # Console reporting avoids modal dialogs on repeated transient errors.
                    print(item[1])
        except queue.Empty:
            pass
        except tk.TclError:
            # The window may be in the process of closing.
            return
        if not self.closing:
            self.root.after(UI_POLL_INTERVAL_MS, self.process_ui_queue)

    def on_item_expand(self, _event=None):
        selected = self.tree.focus()
        container_id = next(
            (cid for cid, node in self.container_nodes.items() if node == selected), None
        )
        if not container_id or self.closing:
            return
        with self.inflight_lock:
            if container_id in self.inflight_processes:
                return
            self.inflight_processes.add(container_id)
        # Remove placeholder/current children now; worker will populate the result.
        for child in self.tree.get_children(selected):
            self.tree.delete(child)
        self.tree.insert(selected, tk.END, text="Loading processes...")
        self.executor.submit(self.fetch_processes, container_id, selected)

    def show_context_menu(self, event):
        item = self.tree.identify_row(event.y)
        if item:
            self.tree.selection_set(item)
            self.tree.focus(item)
            self.context_menu.post(event.x_root, event.y_root)

    def on_double_click(self, _event=None):
        self.open_selected_logs()

    def open_selected_logs(self):
        selected = self.tree.focus()
        if not selected or self.closing:
            return
        container_id = next(
            (cid for cid, node in self.container_nodes.items() if node == selected), None
        )
        if not container_id:
            parent = self.tree.parent(selected)
            container_id = next(
                (cid for cid, node in self.container_nodes.items() if node == parent), None
            )
        if not container_id:
            return
        try:
            container = self.docker_client.containers.get(container_id)
            window = LogViewerWindow(self.root, self.docker_client, container.id, container.name)
            self.log_windows.append(window)
        except Exception as exc:
            print(f"Could not open logs: {exc}")

    def on_close(self):
        """Initiate orderly shutdown without blocking the Tk event loop."""
        if self.closing:
            return
        self.closing = True
        self.running = False
        self.stop_event.set()

        for window in list(self.log_windows):
            try:
                window.on_close()
            except (tk.TclError, AttributeError):
                pass

        # Cancel tasks that have not started. Running Docker requests may finish
        # in the background; they must not schedule Tk callbacks after closing.
        try:
            self.executor.shutdown(wait=False, cancel_futures=True)
        except TypeError:  # Python versions before cancel_futures was added
            self.executor.shutdown(wait=False)
        try:
            self.root.destroy()
        except tk.TclError:
            pass

        # Close the shared Docker client after current worker requests have had a
        # chance to unwind. This cleanup thread never accesses Tk widgets.
        threading.Thread(
            target=self._close_docker_client,
            name="docker-client-cleanup",
            daemon=True,
        ).start()

    def _close_docker_client(self):
        # Wait off the GUI thread for active executor jobs to finish. Docker API
        # calls use a finite timeout, so this should not hold application shutdown
        # indefinitely. Closing the client then helps unblock any remaining log IO.
        try:
            self.poll_thread.join(timeout=1.0)
        except Exception:
            pass
        try:
            self.executor.shutdown(wait=True, cancel_futures=True)
        except TypeError:  # Python versions before cancel_futures was added
            self.executor.shutdown(wait=True)
        except Exception:
            pass
        try:
            self.docker_client.close()
        except Exception:
            pass


if __name__ == "__main__":
    root = tk.Tk()
    app = DockerMonitorApp(root)
    # If Docker initialization failed, the constructor already destroyed root.
    try:
        root.mainloop()
    except tk.TclError:
        pass
