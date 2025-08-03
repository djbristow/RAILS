# Dockerfile for dbristow/mrlm (Adjusted for Reverse Proxy)
# --- Builder Stage ---
FROM node:24-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb/
RUN npm install
COPY . /usr/djb

ENV VITE_MYRLDS_URI=/api/rlds
ENV VITE_MYIPLS_URI=/api/ipls
ENV VITE_MYIPTS_URI=/api/ipts
ENV VITE_MYISBS_URI=/api/isbs
ENV VITE_MYISTS_URI=/api/ists

RUN npm run build

# --- Production/Runtime Stage ---
FROM node:24-slim
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
EXPOSE 8080
CMD [ "http-server", "-p", "8080", "." ]