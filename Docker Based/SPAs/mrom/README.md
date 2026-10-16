# mrim

&copy; David Bristow, 2020-2026

## Version
v1.1.0 2026-10-16

**M**odel **R**ailroad **O**perations **M**anager (MROM) is a MEVN application that provides a user with a web application to manage operations of a model railroad. This web application uses port 3020.

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

* RIDS - Railroad Inventory Data Services running on port 3000
* ISRS - IoT Subscriber running on port 3005

# Vue 3 + Vite

The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Environment Variables

* export VITE_MYRIDS_URI='127.0.0.1:3000'
