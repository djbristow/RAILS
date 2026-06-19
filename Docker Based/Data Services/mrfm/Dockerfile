# --- Builder Stage ---
FROM node:26-slim AS builder
RUN mkdir -p /usr/djb/src/uploads
WORKDIR /usr/djb

# Copy package files and install dependencies
COPY package*.json /usr/djb/
RUN npm install

# Copy application source
COPY . /usr/djb/

# Prune dependencies down to strictly production modules
RUN npm prune --production

# Change ownership of the app directory to the distroless nonroot user/group (ID 65532)
# This ensures Node can write files to the /src/uploads directory in the final stage
RUN chown -R 65532:65532 /usr/djb

# --- Production/Runtime Stage ---
FROM gcr.io/distroless/nodejs20-debian12

# Set the working directory
WORKDIR /app

# Copy the pre-chowned application and production dependencies from builder
COPY --from=builder --chown=65532:65532 /usr/djb /app
COPY --from=builder --chown=65532:65532 /usr/djb/node_modules /app/node_modules

# Environment Variables
ENV MRFM_TCP_PORT=3030
ENV MMRFM_TCP_ADDR='127.0.0.1'
ENV MYMRIM_URI1=http://127.0.0.1:3001
ENV MYMRIM_URI2=http://localhost:3001

EXPOSE 3030

# Run the app securely as the built-in non-root user
USER nonroot

CMD ["./src/app.js"]
