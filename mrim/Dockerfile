FROM node:lts-alpine
RUN npm install -g http-server
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package*.json /usr/djb 
RUN npm install
COPY . /usr/djb
RUN npm run prod
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
