# isrs
&copy; David Bristow, 2020-2023

|**I**oT **S**ubscriber **R**FID **S**ervices is an Express application that subscribes to RFID messages from the MQTT Broker and sends them to a MEVN web application using web sockets. This application uses port 3005.

## Version
v1.2.13 2023-10-18

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

## Run Setup

# install dependencies
npm install

# start NB-RSRM port is 3002 if running on Docker, in dev port is likely 8080
export RSRM_TCP_PORT='3002'
export MQTT_PORT_1883_TCP_ADDR='127.0.0.1'
export MQTT_PORT_1883_TCP_PORT='1883'
node src/app
`'''
