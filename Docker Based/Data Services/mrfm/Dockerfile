FROM node:22-slim
RUN mkdir -p /usr/djb
RUN mkdir -p /usr/djb/src/uploads
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN npm install -g npm@10.8.2
RUN npm install
COPY . /usr/djb
ENV MRFM_TCP_PORT=3030
ENV MMRFM_TCP_ADDR='127.0.0.1'
EXPOSE 3030
CMD ["node", "./src/app.js"]
