FROM node:lts-alpine AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY . /usr/djb
RUN npm install -g npm@10.4.0
RUN npm install
RUN npm run build

FROM node:lts-alpine
RUN npm install -g npm@10.4.0
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
