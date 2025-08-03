FROM node:24-slim
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN npm install
COPY . /usr/djb
ENV RSRM_TCP_URI=localhost:3002
ENV MQTT_TCP_URI=myMqttBrkr:1883
EXPOSE 3005
CMD ["node", "./src/app.js"]
