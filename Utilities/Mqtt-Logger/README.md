# MQTT Logger

&copy; David Bristow, 2020-2026

## Version
v1.0.0 2026-11-11

A lightweight Python application that connects to an MQTT broker, subscribes to configured topics (or all topics using wildcards), and logs incoming messages to both the console and a local text file with timestamps.

## Features

- **External Configuration:** Settings are stored in a separate JSON file (`config.json`), allowing you to change broker details, topics, ports, and output files without modifying the code.
- **Wildcard Support:** Default setup is pre-configured to listen to all topics (`#`), but can easily be scoped to specific topics (e.g., `sensors/rfid`).
- **Auto-Reconnection Support:** Re-subscribes automatically upon connection restoration.
- **Timestamped Logging:** Incoming payload data and topic names are captured alongside exact timestamps.

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

## Prerequisites

- **Python 3.7+** installed on your system.
- An accessible **MQTT Broker** (e.g., [Mosquitto](https://mosquitto.org/), HiveMQ public broker, or a local server).

## Setup Instructions

### 1. Install Dependencies

Install the required `paho-mqtt` library via `pip`:

```bash
pip install paho-mqtt
```

### 2. Configure Settings

Create or edit `config.json` in the same directory as the script:

```json
{
  "mqtt_broker": "localhost",
  "mqtt_port": 1883,
  "mqtt_topic": "#",
  "log_file": "rfid_log.txt"
}
```

#### Configuration Options

| Option | Type | Description |
| : | : | : |
| `mqtt_broker` | String | The IP address or hostname of your MQTT broker (e.g., `"localhost"` or `"broker.hivemq.com"`). |
| `mqtt_port` | Integer | Network port for the broker (default standard is `1883`). |
| `mqtt_topic` | String | Topic to subscribe to. Use `"#"` to listen to **all topics**, or specific paths like `"sensors/rfid"`. |
| `log_file` | String | Output file path where logs will be stored. |

## Running the Application

Run the Python script:

```bash
python mqtt-logger.py
```

### Example Console Output

```text
Connecting to broker at localhost:1883...
Connected successfully to localhost
Subscribed to topic: #
[2026-11-11 11:30:10] Topic: txt2voice | Payload: {"txt":"Dispatcher to Canadian Pacific 5 0 0 0. Clear main track.", "alarm": true}
[2026-11-11 11:31:42] Topic: sensors/rfid | Payload: {"et":"1681397350","sensor":"RfidRdr01","reader":"1","rfid":"1C0044CF24"}
```

### Stopping the Application

Press `Ctrl + C` in your terminal to safely disconnect from the broker and stop the program.
