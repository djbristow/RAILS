# --- Builder Stage ---
FROM node:26-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb/
RUN npm install
COPY . /usr/djb

# Set VITE_ variables to relative paths for the frontend build
ENV VITE_MYRIDS_URI=/api/rids
ENV VITE_MRFM_URI=/images

RUN npm run build

# Create a tiny, native Node static server script to replace http-server
RUN echo "const http = require('http'); \
const fs = require('fs'); \
const path = require('path'); \
const server = http.createServer((req, res) => { \
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url); \
  fs.readFile(filePath, (err, content) => { \
    if (err) { \
      fs.readFile(path.join(__dirname, 'index.html'), (e, index) => { \
        res.writeHead(200, { 'Content-Type': 'text/html' }); \
        res.end(index, 'utf-8'); \
      }); \
    } else { \
      let ext = path.extname(filePath); \
      let contentType = 'text/html'; \
      if (ext === '.js') contentType = 'text/javascript'; \
      if (ext === '.css') contentType = 'text/css'; \
      if (ext === '.json') contentType = 'application/json'; \
      if (ext === '.png') contentType = 'image/png'; \
      if (ext === '.jpg' || ext === '.jpeg') { contentType = 'image/jpeg'; isBinary = true; }; \
      if (ext === '.gif') { contentType = 'image/gif'; isBinary = true; }; \
      if (ext === '.svg') contentType = 'image/svg+xml'; \
      res.writeHead(200, { 'Content-Type': contentType }); \
      res.end(content, 'utf-8'); \
    } \
  }); \
}); \
server.listen(8080, () => console.log('Distroless static server running on port 8080...'));" > /usr/djb/dist/server.js

# --- Production/Runtime Stage ---
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /usr/djb/dist /app
EXPOSE 8080
CMD [ "server.js" ]
