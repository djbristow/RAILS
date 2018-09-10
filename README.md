# RAILS
RAILS is a software model and implemenation of an automated system to assist the model railroader achieve realism in the operation of a model railroad. The model then drives the development of software.
For further information see http://kjcrr.org/rails

## License
RAILS is open source software under the Apache License, Version 2.0 details are available in this repository in the file 
https://github.com/djbristow/RAILS/blob/master/Apache%20License%2C%20Version%202.0

## System Design
The initial components of the design are:
* RFID Sensor - a micro-controller programmed to read an RFID reader and publish the value is a Message Queuing Telemetry Transport (MQTT) client - ther are two directories on for a simulator (rfidsim) and the other for the TI Tiva C microcontroller (microcontroller)
* MQTT Broker - the MQTT broker, the heart of any publish/subscribe protocol, is responsible for receiving messages, filtering them, posting to designated topics and sending messages to clients subscribing to topics (no source code as this component is a docker image available at https://hub.docker.com/_/eclipse-mosquitto/ )
* MongoDB - the MongoDB the data storage compenent is a non-sql database (no source code as this is a docker image avaibale at https://hub.docker.com/_/mongo/ )
* RSRM - the Rolling Stock RFID Manager allows a user to match a RFID value to a rolling stock Road Name and number
* RIDS - Railroad Inventory Data Services a MongoDB database with collections used by RSRM and MRIM
* MRIM - Model Railroad Inventory Manager
* MRFM - Model Railroad File Manager
* ISUB - IoT Subscriber
