# RAILS
&copy; David Bristow, 2019-2023

# Version
* 2.5.3 - 5/18/2023
 
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
![System Design](https://github.com/djbristow/RAILS/blob/master/sysdesign.svg)

The components of this design are:
- Micro Controllers using the Message Queuing Telemetry Transport (MQTT) protocol:
  - RFID Controller – processes RFID tags obtained from a RFID reader and then publishes the value
  - Turnout Controller – subscribes to turnout commands then to act on the command to cause the turnout to move. It then publishes the state of the turnout
  - IR Controller – (in planning) processes IR sensors and publishes their values
- MQTT Broker – the MQTT broker, the heart of any publish/subscribe protocol, is responsible for receiving messages, filtering them, posting to designated topics and sending messages to clients subscribing to topics. The subscribers and publishers bridge the MQTT elements with the GUI applications are the components listed under IoT Services.
- GUI applications that provide users access to RAILS, are the components listed under SPAs.
- Data Micro Services – components that handle data objects
  - MR Data – the document repository, mongoDB, to store complete lists of items such as rolling stock, industries (producers and consumers), track elements,turnouts, projects, purchases, etc.
  - Images – the file store for the images uploaded by MRFM component and used by the MRIM component

|Name |Title                                  |Port |Version|Date     |
|-----|----------------------------------------------------------|-----|-------|---------|
|SPAs|----------------------------------------------------------|
|MPPM|**M**odel **P**rojects and **P**urchase **M**anager allows a user to enter information about their projects and purchases|3008|3.0.1|5/18/2023|
|MRIM|**M**odel **R**ailroad **I**nventory **M**anager allows a user to create, update and delete model railroad assets, such as rolling stock|3001|4.0.3|5/18/2023|
|MRLM|**M**odel **R**ailroad **L**ayout **M**anager allows a user to enter information about their layout and control elements of it|3004|2.0.3|3/2/2023|
|RSRM|**R**olling**s**tock **R**FID **M**anager allows a user to match a RFID value to a rolling stock road name and number|3002|4.0.4|5/18/2023|
|Data Services|----------------------------------------------------------|
|MRFM|**M**odel **R**ailroad **F**ile **M**anager  allows the user to upload image files for the use by the MRIM component|3030|2.0.5|4/24/2023|
|PPDS|**P**lans and **P**urchases **D**ata **S**ervices  provides REST access to model railroad projects and purchases documents|3007|2.1.1|5/18/2023|
|RIDS|**R**ailroad **I**nventory **D**ata **S**ervices provides REST access to railroad inventory documents|3000|2.0.4|5/18/2023|
|RLDS|**R**ailroad **L**ayout **D**ata **S**ervices provides REST access to model railroad projects and purchases documents|3006|2.1.0|5/18/2023|
|IoT Services|----------------------------------------------------------|
|IPLS|**I**oT **P**ublisher Turnout Panel **L**ight **S**ervices publishes light commands to a Turnout Panel Controller|3013|1.0.3|3/1/2023|
|IPTS|**I**oT **P**ublisher **T**urnout **S**ervices publishes turnout commands to a Turnout Controller|3011|2.0.2|3/1/2023|
|ISBS|**I**oT **S**ubscriber Turnout Panel **B**utton **S**ervices subscribes to turnout panel push button events and pushes them via a web-socket to the MRLM component|3012|1.0.4|4/24/2023|
|ISMS|**I**oT **S**ubscriber **M**icro-controller **S**ervices subscribes to micros and adds or updates micros collection in RAILS||2.1.5|4/30/2023|
|ISRS|**I**oT **S**ubscriber **R**FID **S**ervices subscribes to RFID tags and pushes them via a web-socket to the RSRM component |3005|1.2.2|3/1/2023|
|ISTS|**I**oT **S**ubscriber **T**urnout **S**ervices subscribes to turnout switch closures and pushes them via a web-socket to the MRLM component |3010|1.3.2|3/1/2023|





