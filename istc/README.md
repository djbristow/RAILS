# istc
&copy; David Bristow, 2021

**I**oT **S**ubscriber and Publisher **T**urnout Panel **C**ontroller is a node application that subscribes to turnout contact switch (sensors/toc), turnout panel button (sensors/pb), and turnout command (acts/to/#) messages from the MQTT Broker. It publishes turnout panel light (acts/tpl/#) messages. It checks and updates the Turnout collection when a turnout contact switch message was initaited by a panel button event. If the turnout is unlocked and a panel button event is received for that turnout a turnout command is published.

## Version
* 1.0.0 - 3/10/2021

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
* RLDS Railroad Layout Data Services running on port 3006

## Run Setup

``` bash
# install dependencies
npm install

# start
node app
```

when a subscbribed sensor/toc message received set light to state if locked by this app unlock

when button pushed, check to see if the turnout is locked if it is do nothing... if not lock then publish a acts/to/cntrllr# message


