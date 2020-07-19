# mrim
&copy; David Bristow, 2020

## Version
* 1.3.5 - 7/19/2020

Model Railroad Inventory Manager is a MEVN application that provides a user with a web application to display, create and update information of the inventoried items. This web application uses port 3001.

## Managed Inventories
The following lists of items, commonly found in model railroads, are managed by this application:
* Rolling Stock
* AAR Codes
* Images
* Companies

## PDF Reports
The following PDF reports are created by this application:
* AAR Codes
* Companies
* Images
* RFID
* Rolling Stock sortable by Road Name and Road Number or AAR Code or Status

## Import/Export
The application exports inventories in either JSON or CSV and imports files in CSV.

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
* MRFM - Model Railroad File Manager running on port 3003

## Build Setup
```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run prod

# run eslint and repair
npm run lint:fix

