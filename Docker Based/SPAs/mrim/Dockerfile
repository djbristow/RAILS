FROM node:22-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@11.2.0
RUN npm install
COPY . /usr/djb
RUN npm run build

FROM node:22-slim
RUN npm install -g npm@11.2.0
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
ENV VITE_MYRIDS_URI=myRids:3000
ENV VITE_MRFM_URI=myMrfm:3030
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
