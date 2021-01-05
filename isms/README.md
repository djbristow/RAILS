# isms
&copy; David Bristow, 2020-2021

IoT Subscriber is an application that subscribes to micro messages from the MQTT Broker and adds or updates the micros collection.

## Version
* 1.1.2 - 1/5/2021

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
node app
```
