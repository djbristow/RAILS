FROM node:22-slim
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb
RUN npm install -g npm@10.8.2
RUN npm install
COPY . /usr/djb
ENV MONGODB_URI=myMongo:27017
EXPOSE 3000
CMD ["node", "./src/app.js"]
