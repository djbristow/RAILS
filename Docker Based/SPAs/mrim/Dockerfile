FROM node:21-alpine3.19 AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@10.5.0
RUN npm install
COPY . /usr/djb
RUN npm run build

FROM node:21-alpine3.19
RUN npm install -g npm@10.5.0
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
ENV VITE_MYRIDS_URI=myRids:3000
ENV VITE_MRFM_URI=myMrfm:3030
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
