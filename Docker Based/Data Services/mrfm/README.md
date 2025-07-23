# mrfm

&copy; David Bristow, 2019-2025

**M**odel **R**ailroad **F**ile **M**anager is a Hapi application that stores files on the server (POST). The images stored on the server also available for reterival (GET). This application uses port 3030.

## Version
v2.4.6 2025-07-22


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

## Run Setup

    # install dependencies
    npm install

    # start
    export MRFM_TCP_PORT=3030
    export MRFM_TCP_ADDR='127.0.0.1'
    export MYMRIM_URI1='http://127.0.0.1:3001'
    export MYMRIM_URI2='http://localhost:3001'
    node ./src/app
