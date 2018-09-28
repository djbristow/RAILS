FROM node:alpine
RUN npm install -g http-server
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package*.json /usr/djb 
RUN npm install
COPY . /usr/djb
RUN npm run build
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
