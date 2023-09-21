FROM node:lts-alpine
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@10.1.0
RUN npm install
COPY . /usr/djb
EXPOSE 3010
CMD node ./src/app.js
