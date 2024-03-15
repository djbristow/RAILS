FROM node:21-alpine3.19
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@10.5.0
COPY . /usr/djb
CMD node ./src/app.js
