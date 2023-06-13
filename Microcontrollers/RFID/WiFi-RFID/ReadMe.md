# MQTT IOT RFID Reader
&copy; 2020-2022 David J Bristow

# Version
* 2.0.0 - 1/23/2022

This software impmlemnts an IoT RFID reader using an ESP8266 micro controller.


The following actions are accomplished:
 - initial WiFi and MQTT paramters are set at runtime if no SSID found
 - connects to an MQTT broker via wifi
 - publishes info about this reader to the topic "micros"
 - published format: {"et":"1590462747","sensor":"rfidRdr01","msgType":"initial","ip":"192.168.0.19"}
 - publishes a heartbeat to the topic "micros"
 - published format: {"et":"1590462747","sensor":"rfidRdr01","msgType":"heartbeat"}
 - reads values from a single ID-12LA or 7491E RFID readerr, formats the results as a JSON string, 
   gets Epoch time from an NTP server and then publishes the JSON String to the topic "sensors/rfid"
 - published format: {"et":"1590463450","sensor":"rfidRdr01","reader":"1","rfid":"1C0044CF23"}
 - subscribes to "micros/cmd/mqtt_id" where mqtt_id is the paramter defined at runtime as the sensor. 
   When a RESET command is received the wifi and MQTT paramters are removed causing next reboot to 
   require inputs of MQTT paramaters

## License

   This code  is licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at:

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software distributed under the License
   is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   or implied. See the License for the specific language governing permissions and limitations under
   the License.
