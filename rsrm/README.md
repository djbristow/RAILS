# rsrm
&copy; David Bristow, 2020

## Version
* 1.1.3 - 7/19/2020

Rolling Stock RFID Manager is a MEVN application that provides a user with a web application to show, when an RFID tag is read, the road name and number of the rolling stock associated with that tag. If there is no association with a peice of rolling stock input fields are privided to allow the user to eneter the road name and number. This web application uses port 3002.

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
* ISRS IoT Subscriber running on port 3005
* RIDS Railroad Inventory Data Services running on port 3000

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run prod
```
