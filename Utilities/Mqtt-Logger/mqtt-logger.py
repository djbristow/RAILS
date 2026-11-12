# MQTT Logger
#
# &copy; David Bristow, 2020-2026
#
# Version
# v1.0.0 2026-11-11
#
# An offline, low-latency audio announcement system designed for model railroad layouts. It listens for JSON payloads over MQTT, 
# conditionally plays a radio alarm beep, and converts text into natural-sounding speech using local Piper TTS.
# Licensed under the Apache License, Version 2.0 (the "License")
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#    http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import paho.mqtt.client as mqtt
import datetime
import json
import os

CONFIG_FILE = "config.json"

def load_config():
    """Load configuration from an external JSON file."""
    if not os.path.exists(CONFIG_FILE):
        raise FileNotFoundError(f"Configuration file '{CONFIG_FILE}' not found. Please create it.")
    with open(CONFIG_FILE, "r") as f:
        return json.load(f)

# Load configuration values
try:
    config = load_config()
    MQTT_BROKER = config.get("mqtt_broker", "localhost")
    MQTT_PORT = config.get("mqtt_port", 1883)
    MQTT_TOPIC = config.get("mqtt_topic", "#")
    LOG_FILE = config.get("log_file", "rfid_log.txt")
except Exception as e:
    print(f"Error loading configuration: {e}")
    exit(1)

def on_connect(client, userdata, flags, rc):
    """Callback for when the client receives a CONNACK response from the server."""
    if rc == 0:
        print(f"Connected successfully to {MQTT_BROKER}")
        client.subscribe(MQTT_TOPIC)
        print(f"Subscribed to topic: {MQTT_TOPIC}")
    else:
        print(f"Connection failed with code {rc}")

def on_message(client, userdata, msg):
    """Callback for when a PUBLISH message is received from the server."""
    payload = msg.payload.decode('utf-8', errors='ignore')
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] Topic: {msg.topic} | Payload: {payload}\n"
    
    # Print to console for visibility
    print(f"Logging: {log_entry.strip()}")
    
    # Append to file
    with open(LOG_FILE, "a") as f:
        f.write(log_entry)

def main():
    # Create a client instance
    client = mqtt.Client()

    # Assign callbacks
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        print(f"Connecting to broker at {MQTT_BROKER}:{MQTT_PORT}...")
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        
        # Blocking call that processes network traffic, dispatches callbacks and
        # handles reconnecting.
        client.loop_forever()
    except KeyboardInterrupt:
        print("\nDisconnecting from broker...")
        client.disconnect()
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
