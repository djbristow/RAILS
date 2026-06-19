# --- Builder Stage ---
FROM node:26-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb
COPY package.json /usr/djb/
RUN npm install
COPY . /usr/djb

# Set VITE_ variables to relative paths for the frontend build
ENV VITE_MYRIDS_URI=/api/rids 
ENV VITE_MYRLDS_URI=/api/rlds
ENV VITE_MYISRS_URI=/api/isrs

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
      res.writeHead(200, { 'Content-Type': contentType }); \
      res.end(content, 'utf-8'); \
    } \
  }); \
}); \
server.listen(8080, () => console.log('Distroless static server running on port 8080...'));" > /usr/djb/dist/server.js


# --- Production/Runtime Stage ---
# Using Google's minimal Node.js distroless image (Debian 12 based)
FROM gcr.io/distroless/nodejs20-debian12

# Set the working directory inside the distroless container
WORKDIR /app

# Copy the built frontend distribution and our minimal server script from the builder stage
COPY --from=builder /usr/djb/dist /app

EXPOSE 8080

# Run the native node server directly (no shell or npm required)
CMD [ "server.js" ]
