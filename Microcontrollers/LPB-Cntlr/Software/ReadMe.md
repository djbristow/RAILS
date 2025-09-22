# MQTT IOT Lights and Push Buttons Controller
&copy; David J Bristow, 2020-2025

# Version
* 1.0.0 - 2025-09-01

This software impmlemnts a IoT turnout controller for Tortoise motors.
For further information see http://kjcrr.org/

The following actions are accomplished:
  - paramters to connect to the MQTT broker are kept in a params.h file
  - connects to an MQTT broker via wifi
  - subscribes to the topic acts/tpl/LpbCntlrxx where xx is the this controller:
    {"cntrlr":"LpbCntlrxx","lamp":"1|2|3...6","color":"RED|GREEN|BLUE|YELLOW"}
  - reads up to 6 buttons (count set in `params.h`)
  - publishes a JSON message on press  to the topic "sensors/pb":
    {"et":"<epoch>","mcntrlr":"<MQTTID>","pb":"<button#>"}
  - locks that button until a command arrives on the command topic with a matching `lamp` number
  - includes simple debouncing and MQTT reconnection
  - gets Epoch time from an NTP server
  - publishes heartbeat for this controller
  - published format: {"et":"1590462747","sensor":"rfidRdr01","msgType":"heartbeat"}

## License

   This code  is licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

