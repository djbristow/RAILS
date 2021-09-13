# ipts
&copy; David Bristow, 2020-2021

**I**oT **P**ublish **T**urnout **S**ervices is an Express aplication that checks turnout collections to check and update locks. It receives web socket messages providing turnout commands. It publishes mqtt turnout messages to the MQTT Broker. This application uses port 3011.

## Version
* 1.1.4 - 9/13/2021

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
* RLDS
* MQTT Broker running on port 1883


## Run Setup

``` bash
# install dependencies
npm install

# start
export MQTT_PORT_1883_TCP_ADDR='127.0.0.1'
export MQTT_PORT_1883_TCP_PORT='1883'
export RLDS_PORT_3006_TCP_ADDR='127.0.0.1'
export RLDS_PORT_3006_TCP_PORT='3006'
node ./src/app
```
