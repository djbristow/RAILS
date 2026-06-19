# --- Builder Stage ---
FROM node:26-slim AS builder
RUN mkdir -p /usr/djb
WORKDIR /usr/djb

# Copy package files and install ALL dependencies (including devDependencies if needed for build/tests)
COPY package*.json /usr/djb/
RUN npm install

# Copy the rest of the application source code
COPY . /usr/djb/

# Prune node_modules down to strictly production dependencies to keep the final image tiny
RUN npm prune --production

# --- Production/Runtime Stage ---
FROM gcr.io/distroless/nodejs20-debian12

# Set the working directory inside the distroless container
WORKDIR /app

# Copy production dependencies and application source from the builder stage
COPY --from=builder /usr/djb/node_modules /app/node_modules
COPY --from=builder /usr/djb /app

# Fallback environment variable (can be overridden by your docker-compose file)
ENV MONGODB_URI=myMongo:27017

EXPOSE 3006

# Run the application directly via the distroless Node binary
CMD ["./src/app.js"]
