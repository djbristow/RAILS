FROM node:22-alpine
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN npm install -g npm@10.5.0
RUN npm install
COPY . /usr/djb
ENV MONGODB_URI=myMongo:27017
EXPOSE 3000
CMD node ./src/app.js
