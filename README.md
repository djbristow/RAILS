# RAILS
&copy; David Bristow, 2019

# Version
* 1.3.1 - 8/8/2019

RAILS is a software model and implemenation of an automated system to assist the model railroader achieve realism in the operation of a model railroad. The model then drives the development of software.
For further information see http://kjcrr.org/rails

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

## System Design
![System Design](https://github.com/djbristow/RAILS/blob/master/sysdesign.png)

The initial components of the design are:
* RFID Sensor - a micro-controller programmed to read an RFID reader and publish the value is a Message Queuing Telemetry Transport (MQTT) client - there are two directories on for a simulator (rfidsim) and the other for microcontrollers (microcontroller), which contains two sketches one for a the TI Tiva C and another for an ESP8266.
* IR Sensor - (in planning) a micro-controller programmed to read an IR sensors and publish their values is a MQTT client
* MQTT Broker - the MQTT broker, the heart of any publish/subscribe protocol, is responsible for receiving messages, filtering them, posting to designated topics and sending messages to clients subscribing to topics (no source code as this component is a docker image available at https://hub.docker.com/_/eclipse-mosquitto/ )
* MongoDB - the MongoDB the data storage compenent is a non-sql database (no source code as this is a docker image avaibale at https://hub.docker.com/_/mongo/ )
* RSRM - the Rolling Stock RFID Manager allows a user to match a RFID value to a rolling stock Road Name and number
* RIDS - Railroad Inventory Data Services a MongoDB database with collections used by RSRM and MRIM
* MRIM - Model Railroad Inventory Manager
* MRFM - Model Railroad File Manager
* ISRS - IoT Subscriber to RFID Services subscribes to the topic sensors/rfid and sends the Iot message to RSRM
* ISLS - (in planning) IoT Subscriber to Location Services subscribes to topics that provide location information ie IR Sensors and RFID sensors
* PPDS - Project and Purchase Data Services a MongoDB database with collections used by MPPM
* MPPM - Model Project and Purchase Manager allows a user to enter in formation about their projects and purchases

The Kicad-projects directory contains circuit PCB designs for some hardware components.

