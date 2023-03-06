# mppm
&copy; David Bristow, 2019-2023

## Version
* 2.0.6 - 3/2/2023

**M**odel **P**roject and **P**urchase **M**anager is a MEVN application that provides a user with a web application to display, create and update information of the projects and purchased items. Additionally MPPM creates PDF reports of projects and purchases.

This web application uses port 8080 natively but mapped to 3008 in a docker container.

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
* PPDS - Project and Purchase Data Services running on port 3007


## Vue 3 + Vite
The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Environment Variables
* export VITE_MYPPDS_TCP_PORT=3007
* export VITE_MYPPDS_TCP_ADDR='127.0.0.1'
