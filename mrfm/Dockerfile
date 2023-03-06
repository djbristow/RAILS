FROM node:lts-alpine
RUN mkdir -p /usr/djb
RUN mkdir -p /usr/djb/src/uploads
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN npm install -g npm@9.5.1
RUN npm install
COPY . /usr/djb
EXPOSE 3030
CMD node ./src/app.js
