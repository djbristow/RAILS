# RAILS
&copy; David Bristow, 2020

# Version
* 1.11.1 - 12/11/20
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

The components of this design are:
- Micro Controllers using the Message Queuing Telemetry Transport (MQTT) protocol:
  - RFID Controller – processes RFID tags obtained from a RFID reader and then publishes the value
  - Turnout Controller – subscribes to turnout commands then to act on the command to cause the turnout to move. It then publishes the state of the turnout
  - IR Controller – (in planning) processes IR sensors and publishes their values
- MQTT Broker – the MQTT broker, the heart of any publish/subscribe protocol, is responsible for receiving messages, filtering them, posting to designated topics and sending messages to clients subscribing to topics. The subscribers and publishers bridge the MQTT elements with the GUI applications:
  - ISRS – IoT Subscriber RFID Services subscribes to RFID tags and pushes them via a web-socket to the RSRM component
  - ISLS – (in planning) IoT Subscriber Location Services subscribes to topics that provide location information i.e. IR Sensors and RFID sensors
  - ISTS – IoT Subscriber Turnout Services subscribes to turnout switch closures and pushes them via a web-socket to the MRLM component
  - IPTS – IoT Publisher Turnout Services publishes turnout commands to a Turnout Controller
  - ISMS - IoT Subscriber Micro Services subscribes to micros and adds or updates micros collection in RAILS
- GUI applications that provide users access to RAILS
  - RSRM – the Rolling Stock RFID Manager allows a user to match a RFID value to a rolling stock road name and number
  - MRIM – the Model Railroad Inventory Manager allows a user to create, update and delete model railroad assets, such as rolling stock
  - MPPM – the Model Project and Purchase Manager allows a user to enter information about their projects and purchases
  - MRLM – the Model Railroad Layout Manager allows a user to enter information about their layout and control elements of it
- Data Micro Services – components that handle data objects
  - MR Data – the document repository, mongoDB, to store complete lists of items such as rolling stock, industries (producers and consumers), track elements,turnouts, projects, purchases, etc.
  - RIDS – Railroad Inventory Data Services provides REST access to railroad inventory documents
  - PPDS – Project and Purchase Data Services provides REST access to model railroad projects and purchases documents
  - RLDS – Railroad Layout Data Services provides REST access to model railroad layout documents
- MRFM – the Model Railroad File Manager allows the user to upload image files for the use by the MRIM component
- Images – the file store for the images uploaded by MRFM component and used by the MRIM component


|Name |Title                                  |Port |Version|Date     |
|-----|---------------------------------------|-----|-------|---------|
|RIDS|Railroad Inventory Data Services|3000|1.5.0|10/11/2020|
|MRIM|Model Railroad Inventory Manager|3001|2.3.1|11/10/2020|
|RSRM|Rollingstock RFID Manager|3002|2.0.2|9/18/2020|
|MRFM|Model Railroad File Manager|3003|1.0.4|12/11/2020|
|MRLM|Model Railroad Layout Manager|3004|1.1.1|12/11/2020|
|ISRS|IoT Subscriber RFID Services|3005|1.0.6|9/3/2020|
|RLDS|Railroad Layout Data Sevices|3006|1.0.7|12/11/2020|
|PPDS|Plans and Purchases Data Services|3007|1.3.4|12/11/2020|
|MPPM|Model Projects and Purchase Manager|3008|1.5.2|9/20/2020|
|ISMS|IoT Subscriber Micro Controller Services||1.1.1|9/3/2020|
|ISTS|IoT Subscriber Turnout Services|3010|1.0.1|9/3/2020|
|IPTS|IoT Publisher Turnout Services|3011|1.0.1|6/22/2020|



