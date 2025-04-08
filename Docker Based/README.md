# Docker Based Components

&copy; David Bristow, 2019-2025

# Version

* 1.5.9 - 2025-04-07
 
Docker based components are the partial realization of RAILS software model of an automated system to assist the model railroader achieve realism in the operation of a model railroad. These components are the micro-services that are conatinerized and typically run on a PC (Linux, Mac, or Windows) or Single Board Computer running Linux.

The three groups of docker components are: IoT Services, Data Services, and Single Page Applications(SPAs) as defined in the table below. All the Docker based components are highlighted with the rose colored background in the following figure.

![System Design](https://github.com/djbristow/RAILS/blob/master/Docker%20Based/docker-based-ms.svg)

|Name |Title                                  |Port |Version|Date     |
|-----|----------------------------------------------------------|-----|-------|---------|
|SPAs|----------------------------------------------------------|
|MPPM|**M**odel **P**rojects and **P**urchase **M**anager allows a user to enter information about their projects and purchases|3008|3.5.18|2025-04-07|
|MRIM|**M**odel **R**ailroad **I**nventory **M**anager allows a user to enter information about their inventoried items|3001|4.3.19|2025-04-07|
|MRLM|**M**odel **R**ailroad **L**ayout **M**anager allows a user to enter information about their layout and control elements of it|3004|3.2.16|2025-04-07|
|RSRM|**R**olling**s**tock **R**FID **M**anager allows a user to match a RFID value to a rolling stock road name and number|3002|5.0.15|2025-04-07|
|Data Services|----------------------------------------------------------|
|MRFM|**M**odel **R**ailroad **F**ile **M**anager  allows the user to upload image files for the use by the MRIM component|3030|2.4.3|2025-04-07|
|PPDS|**P**lans and **P**urchases **D**ata **S**ervices  provides REST access to model railroad projects and purchases documents|3007|2.3.16|2025-04-07|
|RIDS|**R**ailroad **I**nventory **D**ata **S**ervices provides REST access to railroad inventory documents|3000|2.1.16|2025-04-07|
|RLDS|**R**ailroad **L**ayout **D**ata **S**ervices provides REST access to model railroad projects and purchases documents|3006|2.1.36|2025-04-07|
|IoT Services|----------------------------------------------------------|
|IPLS|**I**oT **P**ublisher Turnout Panel **L**ight **S**ervices publishes light commands to a Turnout Panel Controller|3013|1.1.13|2025-04-07|
|IPTS|**I**oT **P**ublisher **T**urnout **S**ervices publishes turnout commands to a Turnout Controller|3011|2.1.13|2025-04-07|
|ISBS|**I**oT **S**ubscriber Turnout Panel **B**utton **S**ervices subscribes to turnout panel push button events and pushes them via a web-socket to the MRLM component|3014|1.1.16|2025-04-07|
|ISMS|**I**oT **S**ubscriber **M**icro-controller **S**ervices subscribes to micros and adds or updates micros collection in RAILS||3.0.10|2025-03-20|
|ISRS|**I**oT **S**ubscriber **R**FID **S**ervices subscribes to RFID tags and pushes them via a web-socket to the RSRM component|3005|1.3.15|2025-04-07|
|ISTS|**I**oT **S**ubscriber **T**urnout **S**ervices subscribes to turnout switch closures and pushes them via a web-socket to the MRLM component|3010|1.4.13|2025-04-07|

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

