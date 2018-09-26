FROM node:alpine
RUN mkdir -p /usr/djb
RUN mkdir -p /usr/djb/public
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install
COPY . /usr/djb
EXPOSE 3003
CMD node ./app.js
