FROM node:22-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY . /usr/djb
RUN npm install -g npm@10.8.2
RUN npm install
RUN npm run build

FROM node:22-slim
RUN npm install -g npm@10.8.2
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
ENV VITE_MYPPDS_URI=myPpds:3007
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
