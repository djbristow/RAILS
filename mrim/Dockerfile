FROM ubuntu:19.10 AS builder
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -y install nodejs
RUN npm install
RUN npm install
COPY . /usr/djb
RUN npm run prod

FROM node:lts-alpine
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
