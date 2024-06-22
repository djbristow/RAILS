FROM node:22-alpine
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@10.5.0
RUN npm install
COPY . /usr/djb
ENV MQTT_TCP_URI=myMqttBrkr:1883
EXPOSE 3013
CMD node ./src/app.js
