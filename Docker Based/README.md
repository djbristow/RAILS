# Docker Based Components
&copy; David Bristow, 2019-2023

# Version
* 1.0.1 - 6/7/2023
 
Docker based components are the partial realization of RAILS software model of an automated system to assist the model railroader achieve realism in the operation of a model railroad. These components are the micro-services that are conatinerized and typically run on a PC (Linux, Mac, or Windows) or Single Board Computer running Linux.

There three groups of docker components: IoT Services, Data Services, and Single Page Applications(SPAs) as defined in the table below. All of the Docker components shown in the following figure are to the right of and include the MQTT Broker.

![System Design](https://github.com/djbristow/RAILS/blob/master/sysdesign.svg)

|Name |Title                                  |Port |Version|Date     |
|-----|----------------------------------------------------------|-----|-------|---------|
|SPAs|----------------------------------------------------------|
|MPPM|**M**odel **P**rojects and **P**urchase **M**anager allows a user to enter information about their projects and purchases|3008|3.1.2|6/4/2023|
|MRIM|**M**odel **R**ailroad **I**nventory **M**anager allows a user to create, update and delete model railroad assets, such as rolling stock|3001|4.1.2|6/4/2023|
|MRLM|**M**odel **R**ailroad **L**ayout **M**anager allows a user to enter information about their layout and control elements of it|3004|3.0.2|6/4/2023|
|RSRM|**R**olling**s**tock **R**FID **M**anager allows a user to match a RFID value to a rolling stock road name and number|3002|4.1.3|6/4/2023|
|Data Services|----------------------------------------------------------|
|MRFM|**M**odel **R**ailroad **F**ile **M**anager  allows the user to upload image files for the use by the MRIM component|3030|2.0.6|6/4/2023|
|PPDS|**P**lans and **P**urchases **D**ata **S**ervices  provides REST access to model railroad projects and purchases documents|3007|2.1.4|6/4/2023|
|RIDS|**R**ailroad **I**nventory **D**ata **S**ervices provides REST access to railroad inventory documents|3000|2.0.7|6/4/2023|
|RLDS|**R**ailroad **L**ayout **D**ata **S**ervices provides REST access to model railroad projects and purchases documents|3006|2.1.4|6/4/2023|
|IoT Services|----------------------------------------------------------|
|IPLS|**I**oT **P**ublisher Turnout Panel **L**ight **S**ervices publishes light commands to a Turnout Panel Controller|3013|1.0.4|6/4/2023|
|IPTS|**I**oT **P**ublisher **T**urnout **S**ervices publishes turnout commands to a Turnout Controller|3011|2.0.3|6/4/2023|
|ISBS|**I**oT **S**ubscriber Turnout Panel **B**utton **S**ervices subscribes to turnout panel push button events and pushes them via a web-socket to the MRLM component|3012|1.0.6|6/4/2023|
|ISMS|**I**oT **S**ubscriber **M**icro-controller **S**ervices subscribes to micros and adds or updates micros collection in RAILS||2.1.7|6/4/2023|
|ISRS|**I**oT **S**ubscriber **R**FID **S**ervices subscribes to RFID tags and pushes them via a web-socket to the RSRM component |3005|1.2.4|6/4/2023|
|ISTS|**I**oT **S**ubscriber **T**urnout **S**ervices subscribes to turnout switch closures and pushes them via a web-socket to the MRLM component |3010|1.3.3|6/4/2023|

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
