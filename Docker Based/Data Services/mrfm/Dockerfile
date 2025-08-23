FROM node:24-slim
# Update system packages to reduce vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /usr/djb
RUN mkdir -p /usr/djb/src/uploads
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN npm install
COPY . /usr/djb
ENV MRFM_TCP_PORT=3030
ENV MMRFM_TCP_ADDR='127.0.0.1'
ENV MYMRIM_URI1=http://127.0.0.1:3001
ENV MYMRIM_URI2=http://localhost:3001
EXPOSE 3030
CMD ["node", "./src/app.js"]
