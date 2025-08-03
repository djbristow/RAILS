FROM node:24-slim
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install
COPY . /usr/djb
ENV MONGODB_URI=myMongo:27017
EXPOSE 3007
CMD ["node", "./src/app.js"]
