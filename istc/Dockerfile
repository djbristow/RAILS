FROM node:lts-alpine
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install
COPY . /usr/djb
CMD node ./app.js
