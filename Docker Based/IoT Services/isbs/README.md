# isbs

&copy; David Bristow, 2021-2025

**I**oT **S**ubscriber Turnout Panel **B**utton **S**ervices is a node application that subscribes to turnout panel button (sensors/pb) from the MQTT Broker. 

## Version
v1.1.18 2025-07-22
v1.1.13 2025-01-02

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
export MQTT_TCP_URI='127.0.0.1:1883'
export MRLM_TCP_URI='localhost:3004'
node ./src/app
```

