# isms
David Bristow, 2020-2024

**I**oT **S**ubscriber **M**icro-controller **S**ervices is an application that subscribes to micro messages from the MQTT Broker and adds or updates the micros collection via RLDS services. If a heartbeat message is not received within 5 minutes the status of the micro is down graded to "Late" and if it is longer than 10 minutes the status is updated to "Down".

## Version
v3.0.6 2024-11-16

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


## Component dependencies
* MQTT Broker running on port 1883
* RLDS running on port 3006

## Run Setup

``` bash
# install dependencies
npm install

# start
export MQTT_TCP_URI='127.0.0.1:1883'
export RLDS_TCP_URI='127.0.0.1:3006'
node ./src/app
```
