FROM node:24-slim
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@11.4.1
RUN npm install
COPY . /usr/djb
ENV MRLM_TCP_URI=localhost:3004
ENV MQTT_TCP_URI=myMqttBrkr:1883
EXPOSE 3010
CMD ["node", "./src/app.js"]
