# ppds

&copy; David Bristow, 2020-2025

**P**lans and **P**urchases **D**ata **S**ervices is an Express Mongoose aplication that connects to a MongoDB database containing inventory collections and provide data services to MPPM component. This application uses port 3007.

## Version
v2.3.18 2025-07-22
v2.3.13 2025-01-02

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

* MongoDB running on port 27017

## Run Setup

``` bash
# install dependencies
npm install

# start
export MONGODB_URI='127.0.0.1:27017'
node ./src/app
```
