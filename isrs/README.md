# isrs
&copy; David Bristow, 2019

IoT Subscriber is a Express application that subscribes to RFID messages from the MQTT Broker and sends them to a MEVN web application using web sockets. This application uses port 3005.

## Version
* 1.0.4 - 5/25/2020

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

``` bash
# install dependencies
npm install

# start
node app
```
