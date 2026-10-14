import tkinter as tk
from tkinter import ttk, messagebox
import docker
import threading
import time
from concurrent.futures import ThreadPoolExecutor

class LogViewerWindow:
    def __init__(self, parent, docker_client, container_id, container_name):
        self.top = tk.Toplevel(parent)
        self.top.title(f"Logs: {container_name} ({container_id[:12]})")
        self.top.geometry("900x500")

        self.docker_client = docker_client
        self.container_id = container_id
        self.streaming = True

        # Dark theme text console for logs
        self.text_area = tk.Text(
            self.top,
            bg="#1e1e1e",
            fg="#d4d4d4",
            insertbackground="white",
            font=("Monospace", 9),
            wrap=tk.WORD
        )
        self.scrollbar = ttk.Scrollbar(self.top, orient=tk.VERTICAL, command=self.text_area.yview)
        self.text_area.configure(yscrollcommand=self.scrollbar.set)

        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.text_area.pack(fill=tk.BOTH, expand=True)

        # Ensure streaming thread stops when log window is closed
        self.top.protocol("WM_DELETE_WINDOW", self.on_close)

        # Start streaming logs in a background thread
        self.log_thread = threading.Thread(target=self.stream_logs, daemon=True)
        self.log_thread.start()

    def stream_logs(self):
        """Continuously reads log stream from Docker socket."""
        try:
            container = self.docker_client.containers.get(self.container_id)
            # stream=True keeps the socket open; tail=200 loads recent history first
            log_stream = container.logs(stream=True, follow=True, tail=200, timestamps=True)

            for line in log_stream:
                if not self.streaming:
                    break
                decoded_line = line.decode("utf-8", errors="replace")
                self.top.after(0, self.append_log, decoded_line)

        except docker.errors.NotFound:
            self.top.after(0, self.append_log, "\n--- Container was stopped or removed ---\n")
        except Exception as e:
            if self.streaming:
                self.top.after(0, self.append_log, f"\n--- Error streaming logs: {e} ---\n")

    def append_log(self, text):
        """Appends log text and auto-scrolls to the bottom."""
        if self.text_area.winfo_exists():
            self.text_area.insert(tk.END, text)
            self.text_area.see(tk.END)  # Auto-scroll

    def on_close(self):
        """Cleanly halts background streaming on window exit."""
        self.streaming = False
        self.top.destroy()
class DockerMonitorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Docker Container & Process Monitor")
        self.root.geometry("1280x700")

        # Initialize Docker client
        try:
            self.docker_client = docker.from_env()
        except Exception as e:
            messagebox.showerror("Docker Error", f"Could not connect to Docker socket:\n{e}")
            self.root.destroy()
            return

        # Apply Custom Style
        self.style = ttk.Style()
        self.style.theme_use("clam")
        
        self.style.configure(
            "Treeview",
            font=("Liberation Sans", 10),
            rowheight=32,
            fieldbackground="#ffffff"
        )
        self.style.configure(
            "Treeview.Heading",
            font=("Liberation Sans", 10, "bold"),
            background="#e1e1e1",
            relief="flat"
        )

        # Setup Treeview widget
        columns = ("cid", "status", "cpu", "mem", "net", "pid", "ports")
        self.tree = ttk.Treeview(self.root, columns=columns)
        
        self.tree.heading("#0", text="Container / Process (CMD)", anchor=tk.W)
        self.tree.heading("cid", text="Container ID", anchor=tk.CENTER)
        self.tree.heading("status", text="Status", anchor=tk.CENTER)
        self.tree.heading("cpu", text="CPU %", anchor=tk.E)
        self.tree.heading("mem", text="Memory Usage", anchor=tk.E)
        self.tree.heading("net", text="Net I/O", anchor=tk.E)
        self.tree.heading("pid", text="PID", anchor=tk.E)
        self.tree.heading("ports", text="Ports", anchor=tk.W)

        # Column widths
        self.tree.column("#0", width=320)
        self.tree.column("cid", width=110, anchor=tk.CENTER)
        self.tree.column("status", width=110, anchor=tk.CENTER)
        self.tree.column("cpu", width=90, anchor=tk.E)
        self.tree.column("mem", width=180, anchor=tk.E)
        self.tree.column("net", width=150, anchor=tk.E)
        self.tree.column("pid", width=80, anchor=tk.E)
        self.tree.column("ports", width=250, anchor=tk.W)

        scrollbar = ttk.Scrollbar(self.root, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscroll=scrollbar.set)
        
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.tree.bind("<<TreeviewOpen>>", self.on_item_expand)

        # Bind double-click to view logs
        self.tree.bind("<Double-1>", self.on_double_click)

        # Bind right-click for context menu (Button-3 on Linux/Windows, Button-2 on macOS)
        self.tree.bind("<Button-3>", self.show_context_menu)
        
        # Context Menu Setup
        self.context_menu = tk.Menu(self.root, tearoff=0)
        self.context_menu.add_command(label="📋 View Logs", command=self.open_selected_logs)

        # State tracking
        self.container_nodes = {}
        self.prev_cpu_stats = {}

        self.executor = ThreadPoolExecutor(max_workers=20)

        # Start background polling loop
        self.running = True
        self.poll_thread = threading.Thread(target=self.poll_stats_loop, daemon=True)
        self.poll_thread.start()

    @staticmethod
    def format_bytes(b):
        """Converts raw bytes to human readable format."""
        for unit in ['B', 'KiB', 'MiB', 'GiB']:
            if b < 1024.0:
                return f"{b:.1f}{unit}"
            b /= 1024.0
        return f"{b:.1f}TiB"

    @staticmethod
    def format_ports(ports_dict):
        """Formats Docker ports dictionary into a clean string representation."""
        if not ports_dict:
            return "--"
        port_mappings = []
        for container_port, host_bindings in ports_dict.items():
            if host_bindings:
                host_ports = ",".join([h.get("HostPort", "") for h in host_bindings if h.get("HostPort")])
                if host_ports:
                    port_mappings.append(f"{host_ports}->{container_port}")
                else:
                    port_mappings.append(container_port)
            else:
                port_mappings.append(container_port)
        return ", ".join(port_mappings) if port_mappings else "--"

    @staticmethod
    def format_uptime(started_at_str):
        """Parses ISO timestamp from Docker State and returns a human-friendly uptime string."""
        from datetime import datetime, timezone

        try:
            cleaned_ts = started_at_str.split(".")[0] if "." in started_at_str else started_at_str.rstrip("Z")
            start_dt = datetime.strptime(cleaned_ts, "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)
            now_dt = datetime.now(timezone.utc)
            
            delta = now_dt - start_dt
            seconds = int(delta.total_seconds())

            if seconds < 60:
                return f"{seconds} seconds"
            elif seconds < 3600:
                return f"{seconds // 60} minutes"
            elif seconds < 86400:
                hours = seconds // 3600
                return f"{hours} hour{'s' if hours > 1 else ''}"
            else:
                days = seconds // 86400
                return f"{days} day{'s' if days > 1 else ''}"
        except Exception:
            return "running"

    def refresh_containers(self):
        """Scans Docker Engine, adds new containers, and schedules removal of stopped ones."""
        try:
            containers = self.docker_client.containers.list()
            current_ids = {c.id for c in containers}

            # Remove containers that no longer exist
            for c_id in list(self.container_nodes.keys()):
                if c_id not in current_ids:
                    self.remove_container_node(c_id)

            # Add newly started containers
            for container in containers:
                if container.id not in self.container_nodes:
                    short_id = container.short_id
                    state = container.attrs.get("State", {})
                    raw_status = state.get("Status", "running").capitalize()
                    started_at = state.get("StartedAt", "")
                    uptime_str = self.format_uptime(started_at) if started_at else raw_status
                    status_display = f"Up {uptime_str}" if raw_status.lower() == "running" else raw_status

                    ports_str = self.format_ports(container.ports)
                    values = (short_id, status_display, "0.00%", "Loading...", "--", "--", ports_str)

                    # Schedule insertion on the GUI main thread
                    self.root.after(0, self._add_container_to_tree, container.id, container.name, values)
        except Exception as e:
            print(f"Error scanning containers: {e}")

    def _add_container_to_tree(self, container_id, container_name, values):
        """Helper to insert new container node on the main thread."""
        if container_id not in self.container_nodes:
            node = self.tree.insert("", tk.END, text=f"📦 {container_name}", values=values)
            self.tree.insert(node, tk.END, text="Loading processes...")
            self.container_nodes[container_id] = node

    def remove_container_node(self, container_id):
        """Safely schedules removal of a container row from the UI and tracking dicts."""
        node_id = self.container_nodes.pop(container_id, None)
        if container_id in self.prev_cpu_stats:
            del self.prev_cpu_stats[container_id]
            
        if node_id:
            self.root.after(0, self._delete_tree_node, node_id)

    def _delete_tree_node(self, node_id):
        """Helper to delete tree item on the main UI thread."""
        if self.tree.exists(node_id):
            self.tree.delete(node_id)

    def on_item_expand(self, event):
        """Lazy-loads child processes via container.top() when twisty is clicked."""
        selected_item = self.tree.focus()
        
        container_id = None
        for c_id, node_id in self.container_nodes.items():
            if node_id == selected_item:
                container_id = c_id
                break

        if not container_id:
            return

        try:
            container = self.docker_client.containers.get(container_id)
            top_data = container.top(ps_args="-aux")
            
            for child in self.tree.get_children(selected_item):
                self.tree.delete(child)

            titles = top_data.get("Titles", [])
            processes = top_data.get("Processes", [])

            pid_idx = titles.index("PID") if "PID" in titles else 1
            cpu_idx = titles.index("%CPU") if "%CPU" in titles else -1
            mem_idx = titles.index("%MEM") if "%MEM" in titles else -1
            cmd_idx = titles.index("COMMAND") if "COMMAND" in titles else -1

            for proc in processes:
                pid = proc[pid_idx] if pid_idx < len(proc) else "--"
                cpu = f"{proc[cpu_idx]}%" if cpu_idx != -1 and cpu_idx < len(proc) else "--"
                mem = f"{proc[mem_idx]}%" if mem_idx != -1 and mem_idx < len(proc) else "--"
                cmd = proc[cmd_idx] if cmd_idx != -1 and cmd_idx < len(proc) else proc[-1]

                sub_values = ("--", "--", cpu, mem, "--", pid, "--")
                self.tree.insert(selected_item, tk.END, text=f"  ⚙️ {cmd}", values=sub_values)

        except docker.errors.NotFound:
            self.remove_container_node(container_id)
        except Exception as e:
            print(f"Error fetching top for {container_id}: {e}")

    def fetch_single_container_stats(self, container_id, node_id):
        """Fetches stats for a single container in a worker thread."""
        try:
            container = self.docker_client.containers.get(container_id)
            stats = container.stats(stream=False)

            # Live Uptime
            state = container.attrs.get("State", {})
            raw_status = state.get("Status", "running").capitalize()
            started_at = state.get("StartedAt", "")
            uptime_str = self.format_uptime(started_at) if started_at else raw_status
            status_display = f"Up {uptime_str}" if raw_status.lower() == "running" else raw_status

            # CPU calculation
            cpu_stats = stats.get("cpu_stats", {})
            precpu_stats = stats.get("precpu_stats", {})
            
            cpu_total = cpu_stats.get("cpu_usage", {}).get("total_usage", 0)
            system_total = cpu_stats.get("system_cpu_usage", 0)
            
            prev = self.prev_cpu_stats.get(container_id, (0, 0))
            prev_cpu, prev_system = prev
            
            if precpu_stats.get("cpu_usage", {}).get("total_usage", 0) > 0:
                prev_cpu = precpu_stats.get("cpu_usage", {}).get("total_usage", 0)
                prev_system = precpu_stats.get("system_cpu_usage", 0)

            cpu_delta = cpu_total - prev_cpu
            system_delta = system_total - prev_system
            online_cpus = cpu_stats.get("online_cpus", 1) or 1

            cpu_percent = 0.0
            if system_delta > 0 and cpu_delta > 0:
                cpu_percent = (cpu_delta / system_delta) * online_cpus * 100.0

            self.prev_cpu_stats[container_id] = (cpu_total, system_total)

            # Memory calculation
            mem_stats = stats.get("memory_stats", {})
            mem_usage = mem_stats.get("usage", 0) / (1024 * 1024)
            mem_limit = mem_stats.get("limit", 1) / (1024 * 1024)
            mem_str = f"{mem_usage:.1f} MiB / {mem_limit:.0f} MiB"

            # Net I/O calculation
            networks = stats.get("networks", {})
            rx_bytes = sum(net.get("rx_bytes", 0) for net in networks.values()) if networks else 0
            tx_bytes = sum(net.get("tx_bytes", 0) for net in networks.values()) if networks else 0
            net_str = f"{self.format_bytes(rx_bytes)} / {self.format_bytes(tx_bytes)}"

            # UI Update
            self.root.after(0, self.update_node_stats, node_id, status_display, f"{cpu_percent:.2f}%", mem_str, net_str)

        except docker.errors.NotFound:
            # Handle 404 cleanly by dropping the removed container from the UI
            self.remove_container_node(container_id)
        except Exception as e:
            print(f"Error updating stats for container {container_id[:12]}: {e}")

    def poll_stats_loop(self):
        """Background coordinator loop that periodically rescans and updates stats."""
        while self.running:
            # Rescan engine state to discover new or removed containers
            self.refresh_containers()

            # Dispatch worker threads for each active container
            for container_id, node_id in list(self.container_nodes.items()):
                self.executor.submit(self.fetch_single_container_stats, container_id, node_id)
            
            time.sleep(2)

    def update_node_stats(self, node_id, status_str, cpu_str, mem_str, net_str):
        """Applies updated metrics directly to the Treeview widget."""
        if self.tree.exists(node_id):
            current_vals = list(self.tree.item(node_id, "values"))
            current_vals[1] = status_str
            current_vals[2] = cpu_str
            current_vals[3] = mem_str
            current_vals[4] = net_str
            self.tree.item(node_id, values=current_vals)

    def show_context_menu(self, event):
        """Shows right-click menu over the selected item."""
        item = self.tree.identify_row(event.y)
        if item:
            self.tree.selection_set(item)
            self.context_menu.post(event.x_root, event.y_root)

    def on_double_click(self, event):
        """Triggers log viewer on double clicking a container row."""
        self.open_selected_logs()

    def open_selected_logs(self):
        """Identifies selected container and opens a new log window."""
        selected_item = self.tree.focus()
        if not selected_item:
            return

        # Check if the selected row is a container or sub-process
        container_id = None
        for c_id, node_id in self.container_nodes.items():
            if node_id == selected_item:
                container_id = c_id
                break

        # If user clicked a child process, resolve up to the parent container node
        if not container_id:
            parent_node = self.tree.parent(selected_item)
            for c_id, node_id in self.container_nodes.items():
                if node_id == parent_node:
                    container_id = c_id
                    break

        if container_id:
            try:
                container = self.docker_client.containers.get(container_id)
                LogViewerWindow(self.root, self.docker_client, container.id, container.name)
            except Exception as e:
                print(f"Could not open logs: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = DockerMonitorApp(root)
    root.mainloop()
