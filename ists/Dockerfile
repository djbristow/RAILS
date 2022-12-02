FROM node:lts-alpine
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@9.1.3
RUN npm install
COPY . /usr/djb
EXPOSE 3010
CMD node ./app.js
