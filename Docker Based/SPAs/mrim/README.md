# mrim

&copy; David Bristow, 2020-2025

## Version
v4.3.16 2025-01-19
v4.3.15 2025-01-02

**M**odel **R**ailroad **I**nventory **M**anager is a MEVN application that provides a user with a web application to display, create and update information of the inventoried items. This web application uses port 3001.

## Managed Inventories

The following lists of items, commonly found in model railroads, are managed by this application:

* Rolling Stock
* DCC decoders
* AAR Codes
* Images
* Companies
* Structures

## PDF Reports

The following PDF reports are created by this application:

* AAR Codes
* Companies
* Images
* RFID
* Rolling Stock sortable by Road Name and Road Number or AAR Code or Status

## Import/Export

The application exports and inventories in CSV files.

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
* MRFM - Model Railroad File Manager running on port 3030

# Vue 3 + Vite

The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Environment Variables

* export VITE_MRFM_URI='127.0.0.1:3030'
* export VITE_MYRIDS_URI='127.0.0.1:3000'
