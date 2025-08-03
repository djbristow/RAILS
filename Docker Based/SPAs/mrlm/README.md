# mrlm

&copy; David Bristow, 2020-2025

## Version
v4.0.0 2025-07-30


Model Railway Layout Manager is a Vue application that provides a user with a web application to show layout information.  This web application uses port 3004.

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

* ISTS IoT Subscriber running on port 3010
* RLDS Railroad Layout Data Services running on port 3006
* IPTS IoT Publisher running on port 3011
* ISBS IOT Subscriber running on port 3012

## Environment Variables

* export VITE_MYRLDS_URI='127.0.0.1:3006'
* export VITE_MYIPLS_URI='127.0.0.1:3013'
* export VITE_MYIPTS_URI='127.0.0.1:3011'
* export VITE_MYISBS_URI='127.0.0.1:3014'
* export VITE_MYISTS_URI='127.0.0.1:3010'

## Running the application in Dev
To run the application in development mode, you can use the following command:

```bash
npm run dev
```
