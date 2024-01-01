FROM node:lts-alpine
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@10.2.5
RUN npm install
COPY . /usr/djb
EXPOSE 3007
CMD node ./src/app.js
