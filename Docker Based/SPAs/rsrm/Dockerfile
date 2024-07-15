FROM node:slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb 
RUN npm install -g npm@10.5.0
RUN npm install
COPY . /usr/djb
RUN npm run build

FROM node:slim 
RUN npm install -g npm@10.5.0
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
ENV VITE_MYISRS_URI=myIsrs:3005
ENV VITE_MYRIDS_URI=myRids:3000
ENV VITE_MYRLDS_URI=myRlds:3006
EXPOSE 8080
CMD [ "http-server", "/usr/djb/dist" ]
