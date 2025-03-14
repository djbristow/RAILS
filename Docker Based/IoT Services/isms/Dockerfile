FROM node:22-slim
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN npm install -g npm@11.2.0
RUN npm install
COPY . /usr/djb
ENV MQTT_TCP_URI=myMqttBrkr:1883
ENV RLDS_TCP_URI=myRlds:3006
CMD ["node", "./src/app.js"]
