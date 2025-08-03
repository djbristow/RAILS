# Dockerfile for dbristow/rsrm (Adjusted fo)r Reverse Proxy
# --- Builder Stage ---
FROM node:24-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb/
RUN npm install
COPY . /usr/djb

# Set VITE_ variables to relative paths for the frontend build
# These are baked into the JS bundle. The reverse proxy will handle routing.
ENV VITE_MYRIDS_URI=/api/rids 
ENV VITE_MYRLDS_URI=/api/rlds
ENV VITE_MYISRS_URI=/api/isrs

RUN npm run build

# --- Production/Runtime Stage ---
FROM node:24-slim
RUN npm install -g http-server
RUN mkdir -p /usr/djb/dist
WORKDIR /usr/djb/dist
COPY --from=builder /usr/djb/dist .
EXPOSE 8080
CMD [ "http-server", "-p", "8080", "." ]
