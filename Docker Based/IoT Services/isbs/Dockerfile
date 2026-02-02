FROM node:25-slim
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install
COPY . /usr/djb
ENV MRLM_TCP_URI=localhost:3004
ENV MQTT_TCP_URI=myMqttBrkr:1883
EXPOSE 3012
CMD ["node", "./src/app.js"]
