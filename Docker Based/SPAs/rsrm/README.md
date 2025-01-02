# rsrm

&copy; David Bristow, 2020-2025

## Version

v5.0.10 2025-01-02

**R**olling**s**tock **R**FID **M**anager is a Mongo Express Vue Node (MEVN) application that provides a user with a web application to show, when an RFID tag is read, the road name and number of the rolling stock associated with that tag. If there is no association with a peice of rolling stock input fields are provided to allow the user to enter the road name and number. This web application uses port 3002.

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

* ISRS: IoT Subscriber running on port 3005
* ISMS: IoT Subscriber Micro-controller Services
* RIDS: Railroad Inventory Data Services running on port 3000
* RLDS: Railroad Layout Data Services on port 3006

Environment Variables
export VITE_MYISRS_URI='127.0.0.1:3005'
export VITE_MYRIDS_URI='127.0.0.1:3000'
export VITE_MYRLDS_URI='127.0.0.1:3006'
