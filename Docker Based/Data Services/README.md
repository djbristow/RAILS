# Data Services

&copy; David Bristow, 2019-2025

# Version

v1.1.0 - 2025-07-22
 
Data Services provide the mechanisms to add, modify and remove data. The custom designed and developed micro-services are shown in the following table. The Data services are highlighted with the light blue colored background in the following figure.

![System Design](https://github.com/djbristow/RAILS/blob/master/Docker%20Based/Data%20Services/data-ms.svg)

|Name |Title                                  |Port |
|-----|----------------------------------------------------------|-----|
|MRFM|**M**odel **R**ailroad **F**ile **M**anager  allows the user to upload image files for the use by the MRIM component|3030|
|PPDS|**P**lans and **P**urchases **D**ata **S**ervices  provides REST access to model railroad projects and purchases documents|3007|
|RIDS|**R**ailroad **I**nventory **D**ata **S**ervices provides REST access to railroad inventory documents|3000|
|RLDS|**R**ailroad **L**ayout **D**ata **S**ervices provides REST access to model railroad projects and purchases documents|3006|

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
