# rsrm
&copy; David Bristow, 2018

Rolling Stock RFID Manager is a MEVN application that provides a user with a web application to show, when an RFID tag is read, the road name and number of the rolling stock associated with that tag. If there is no association with a peice of rolling stock input fields are privided to allow the user to eneter the road name and number. This web application uses port 3002.

## License
rsrm, a component of RAILS, is open source software under the Apache License, Version 2.0 details are available in this repository in the file https://github.com/djbristow/RAILS/blob/master/Apache%20License%2C%20Version%202.0

## Component dependencies
* ISUB IoT Subscriber running on port 3005
* RIDS Railroad Inventory Data Services running on port 3000

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
