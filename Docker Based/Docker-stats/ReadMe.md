# Docker-stats
&copy; David Bristow, 2019-2025

## Version
* 1.0.0 - 2025-10-18


The Rust application is a graphical Docker container and process monitor. It connects to the Docker Engine on your computer, displays running containers and their resource usage, lets you inspect the processes inside each container, and provides a live log viewer.

The main features:

* Container monitoring - Lists running Docker containers, showing their names, abbreviated IDs, status, uptime, CPU usage, memory usage, network traffic, and exposed port mappings.
* Live resource statistics - Refreshes container discovery and resource statistics approximately every two seconds, displaying CPU utilization, memory consumption, and cumulative network bytes received and transmitted.
* Container process inspection - Expand a container in the interface to retrieve its process list using Docker's top() method. Individual processes are displayed as child rows with their command, PID, CPU percentage, and memory percentage.
* Live log viewer - Double-click a container or right-click and choose View Logs to open a separate log window. It initially loads the last 200 log entries, includes timestamps, continuously streams new entries, and automatically scrolls to the bottom.

## License

    The code in this repository is licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

**NOTE**: This software depends on other packages that may be licensed under different open source licenses.

## Build

``` bash
cargo build --release
```
**NOTE**: The executable will be contained within the target/release folder.
