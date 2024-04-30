# Documentation
David Bristow, 2019-2024

# Version
* 1.2.0 - 2024-04-30

Documentation like code is under continual development and only portrays a snapshot in time. The directories in this directory contain documentation about various aspects of RAILS and are developed using Latex technologies.
There are two documents available:
* System Design and Implemenation - A document discussing the concept of RAILS and its design,  a downloadable pdf can be found at https://kjcrr.org/?page_id=673
* Docker Implemenation - A document explaining how to setup and run the Docker based microservices of RAILS, a downloadable pdf can be found at https://kjcrr.org/?page_id=750

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

## Publish a document

``` bash
# cd to the directory of the desired document
cd System
# then using the head tex file
lualatex rails-system
