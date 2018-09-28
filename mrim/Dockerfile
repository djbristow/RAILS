FROM node:alpine
RUN npm install -g http-server
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package*.json /usr/djb 
RUN npm install
RUN npm audit fix
COPY . /usr/djb
RUN npm run build
RUN rm -R src
RUN rm -R config
RUN rm -R build
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
