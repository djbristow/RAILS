# Layout Text-to-Voice (Txt2Voice) MQTT Dispatcher
#
# &copy; David Bristow, 2020-2025
#
# Version
#v1.0.0 2026-10-27
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


import json
import subprocess
import paho.mqtt.client as mqtt

# ==============================================================================
# Configuration
# ==============================================================================
MQTT_BROKER = "192.168.4.200"
MQTT_PORT = 1883
MQTT_TOPIC = "txt2voice"

# Piper TTS settings
PIPER_BIN = "/home/dbristow/Txt2Voice/venv/bin/piper"
PIPER_MODEL = "./models/en_GB-southern_english_female-low.onnx"
AUDIO_OUTPUT_DEVICE = "default"  # e.g., 'plughw:0,0' or 'default'

# Voice Sample Rate (16000 for 'low' models, 22050 for 'medium')
VOICE_SAMPLE_RATE = "16000"

# ==============================================================================
# Audio Functions
# ==============================================================================
def play_generated_beep(duration_seconds=0.25, freq=1000):
    """Generates a brief radio beep using ALSA's speaker-test utility."""
    try:
        cmd = [
            "speaker-test",
            "-D", AUDIO_OUTPUT_DEVICE,
            "-t", "sine",
            "-f", str(freq),
            "-l", "1"
        ]
        proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        proc.wait(timeout=duration_seconds)
    except subprocess.TimeoutExpired:
        proc.kill()
    except Exception as e:
        print(f"[Warning] Failed to generate radio beep: {e}")

def announce_text(text: str, play_beep: bool = False):
    """Streams text to Piper TTS, optionally playing a radio beep first."""
    if play_beep:
        play_generated_beep(duration_seconds=0.25, freq=1000)

    piper_cmd = [PIPER_BIN, "--model", PIPER_MODEL, "--output-raw"]
    aplay_cmd = [
        "aplay",
        "-D", AUDIO_OUTPUT_DEVICE,
        "-r", VOICE_SAMPLE_RATE,
        "-f", "S16_LE",
        "-t", "raw",
        "-"
    ]

    try:
        piper_proc = subprocess.Popen(piper_cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        aplay_proc = subprocess.Popen(aplay_cmd, stdin=piper_proc.stdout)
        
        piper_proc.stdin.write(text.encode("utf-8") + b"\n")
        piper_proc.stdin.flush()
        piper_proc.stdin.close()
        
        aplay_proc.wait()
    except Exception as e:
        print(f"[Error] Failed to generate audio announcement: {e}")

# ==============================================================================
# MQTT Callback Handlers
# ==============================================================================
def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Connected connected successfully to MQTT Broker")
        client.subscribe("txt2voice")
    else:
        print(f"Connection failed with result code: {reason_code}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode("utf-8"))
        text_to_speak = payload.get("txt")
        is_alarm = payload.get("alarm", False)  # Defaults to False if omitted

        if not text_to_speak:
            print("[MQTT] Received message without 'txt' field.")
            return

        print(f"[Announcement] Alarm: {is_alarm} | Speaking: {text_to_speak}")
        announce_text(text_to_speak, play_beep=is_alarm)

    except json.JSONDecodeError:
        print(f"[Error] Non-JSON payload received on {msg.topic}")
    except Exception as e:
        print(f"[Error] Processing message: {e}")

# ==============================================================================
# Main Execution Loop
# ==============================================================================
if __name__ == "__main__":
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message

    print("[System] Starting Text-to-Voice service...")
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    
    try:
        client.loop_forever()
    except KeyboardInterrupt:
        print("\n[System] Shutting down service.")
        client.disconnect()
