# ipls
&copy; David Bristow, 2021-2024

**I**oT **P**ublisher Turnout Panel **L**ight **S**ervices is a node application that publishes turnout panel light (acts/tpl/#) messages to the MQTT Broker. This application uses port 3013.

## Version
v1.0.14 2023-12-22

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
export MQTT_PORT_1883_TCP_ADDR='127.0.0.1'
export MQTT_PORT_1883_TCP_PORT='1883'
node ./src/app
```

