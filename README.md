# RAILS
&copy; David Bristow, 2019-2021

# Version
* 1.12.6 - 8/28/21
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
  - ISRS – **I**oT **S**ubscriber **R**FID **S**ervices subscribes to RFID tags and pushes them via a web-socket to the RSRM component
  - ISLS – (in planning) IoT Subscriber Location Services subscribes to topics that provide location information i.e. IR Sensors and RFID sensors
  - ISTS – **I**oT **S**ubscriber **T**urnout **S**ervices subscribes to turnout switch closures and pushes them via a web-socket to the MRLM component
  - IPTS – **I**oT **P**ublisher **T**urnout **S**ervices publishes turnout commands to a Turnout Controller
  - ISMS – **I**oT **S**ubscriber **M**icro-controller **S**ervices subscribes to micros and adds or updates micros collection in RAILS
  - ISTC - **I**oT **S**ubscriber and Publisher **T**urnout Panel **C**ontroller subscribes to turnout commands, push button events, and turnout contacts. It publishes turnout commands and turnout panel light connands
- GUI applications that provide users access to RAILS
  - RSRM – the **R**olling**s**tock **R**FID **M**anager allows a user to match a RFID value to a rolling stock road name and number
  - MRIM – the **M**odel **R**ailroad **I**nventory **M**anager allows a user to create, update and delete model railroad assets, such as rolling stock
  - MPPM – the **M**odel **P**rojects and **P**urchase **M**anager allows a user to enter information about their projects and purchases
  - MRLM – the **M**odel **R**ailroad **L**ayout **M**anager a user to enter information about their layout and control elements of it
- Data Micro Services – components that handle data objects
  - MR Data – the document repository, mongoDB, to store complete lists of items such as rolling stock, industries (producers and consumers), track elements,turnouts, projects, purchases, etc.
  - RIDS – **R**ailroad **I**nventory **D**ata **S**ervices provides REST access to railroad inventory documents
  - PPDS – **P**lans and **P**urchases **D**ata **S**ervices provides REST access to model railroad projects and purchases documents
  - RLDS – **R**ailroad **L**ayout **D**ata **S**ervices provides REST access to model railroad layout documents
  - MRFM – the **M**odel **R**ailroad **F**ile **M**anager allows the user to upload image files for the use by the MRIM component
  - Images – the file store for the images uploaded by MRFM component and used by the MRIM component

|Name |Title                                  |Port |Version|Date     |
|-----|---------------------------------------|-----|-------|---------|
|RIDS|**R**ailroad **I**nventory **D**ata **S**ervices|3000|1.5.2|8/28/2021|
|MRIM|**M**odel **R**ailroad **I**nventory **M**anager|3001|2.3.7|8/28/2021|
|RSRM|**R**olling**s**tock **R**FID **M**anager|3002|2.0.9|8/28/2021|
|MRFM|**M**odel **R**ailroad **F**ile **M**anager|3003|1.0.4|12/11/2020|
|MRLM|**M**odel **R**ailroad **L**ayout **M**anager|3004|1.2.0|3/8/2021|
|ISRS|**I**oT **S**ubscriber **R**FID **S**ervices|3005|1.0.8|5/8/2021|
|RLDS|**R**ailroad **L**ayout **D**ata **S**ervices|3006|1.1.1|8/28/2021
|PPDS|**P**lans and **P**urchases **D**ata **S**ervices|3007|1.3.6|8/28/2021|
|MPPM|**M**odel **P**rojects and **P**urchase **M**anager|3008|1.5.8|8/28/2021|
|ISMS|**I**oT **S**ubscriber **M**icro-controller **S**ervices||1.2.0|3/14/2021|
|ISTS|**I**oT **S**ubscriber **T**urnout **S**ervices|3010|1.0.3|5/8/2021|
|IPTS|**I**oT **P**ublisher **T**urnout **S**ervices|3011|1.1.2|3/14/2021|
|ISTC|**I**oT **S**ubscriber and Publisher **T**urnout Panel **C**ontroller||1.1.0|3/14/2021|



