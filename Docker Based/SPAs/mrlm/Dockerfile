FROM node:22-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@10.9.1
RUN npm install
COPY . /usr/djb
RUN npm run build

FROM node:22-slim
RUN npm install -g npm@10.9.1
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
ENV VITE_MYRLDS_TCP_URI=myRlds:3006
ENV VITE_MYIPLS_TCP_URI=myIpls:3013
ENV VITE_MYIPTS_TCP_URI=myIpts:3011
ENV VITE_MYISBS_TCP_URI=myIsbs:3012
ENV VITE_MYISTS_TCP_URI=myIsts:3010
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
