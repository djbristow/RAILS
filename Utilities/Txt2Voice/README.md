# Layout Text-to-Voice (Txt2Voice) MQTT Dispatcher

&copy; David Bristow, 2020-2025

## Version
v1.0.0 2026-10-27

An offline, low-latency audio announcement system designed for model railroad layouts. It listens for JSON payloads over MQTT, conditionally
plays a radio alarm beep, and converts text into natural-sounding speech using local Piper TTS.

* **MQTT Listener:** Subscribes to a designated MQTT topic (e.g., `txt2voice`).
* **JSON Payload Parsing:** Accepts messages containing text (`"txt"`) and an optional alarm flag (`"alarm": true/false`).
  {"txt":"Dispatcher to Union Pacific 4 0 1 4. Clear main track.", "alarm": true}
* **Audio Feedback:** Optionally generates a 1000 Hz radio beep tone via ALSA before broadcasting announcements.
* **1000% Offline:** Zero cloud dependency, keeping layout audio fast, private, and reliable.

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

## Voices
Piper offers dozens of high-quality, natural-sounding neural voices across multiple languages and accents (including male and female voices,
varying speeds, and quality tiers like low, medium, and high), They samples and files can be found at https://rhasspy.github.io/piper-samples
There are two files for each voice:

* The Model File (.onnx): Contains the neural network weights for that voice.
* The Configuration File (.onnx.json): Contains phonemization rules, sample rates, and configuration parameters.

(Make sure to download both files for the exact same voice name/quality level).

In the Txt2Voice directory create sub directory models where the .onnx and .onnx.json files are to be stored

## 1. Python Environment Setup

Navigate to your project directory and set up your Python virtual environment and dependencies, the following is an example on my Linux Mint PC:

```bash
cd /home/dbristow/Txt2Voice

# Create the virtual environment if it doesn't exist
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip and install required packages
pip install --upgrade pip
pip install paho-mqtt piper-tts
```

## 2. Running Manually
To test the script manually within your virtual environment:

```bashBash
source venv/bin/activate python3 txt2voice.py 
```

## 3. Systemd Background Service Setup
To have the script run automatically in the background on system boot, configure it as a user systemd service.
* Create a directory 

```bash
mkdir -p ~/.config/systemd/user/
```
* Move the file txt2voice.service into that newly created directory

* Enable Lingering (Crucial for Audio Services)
Allow user background services to run even when you aren't logged into the desktop GUI:

```bash
sudo loginctl enable-linger $USER
```
* Enable and Start the Service

```bash
systemctl --user daemon-reload
systemctl --user enable txt2voice.service
systemctl --user start txt2voice.service
```

## Useful Service Commands
* Check Status:
```bash
systemctl --user status txt2voice.service
```
* View Live Logs:
```bash
journalctl --user -u txt2voice.service -f
```
* Restart Service:
```bash
systemctl --user restart txt2voice.service
```
