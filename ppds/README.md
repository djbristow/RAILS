# ppds
&copy; David Bristow, 2020-2023

Projects and Purchases Data Services is an Express Mongoose aplication that connects to a MongoDB database containing inventory collections and provide data services to MPPM component. This application uses port 3007.

## Version
* 2.0.6 - 4/30/2023

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
export MONGODB_PORT_27017_TCP_ADDR='127.0.0.1'
export MONGODB_PORT_27017_TCP_PORT='27017'
node ./src/app
```
