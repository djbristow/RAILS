# ==========================================
# Stage 1: Build & Dependency Installation
# ==========================================
FROM node:26-slim AS build

# Set a clean working directory for dependency compilation
WORKDIR /app

# Copy package files first to leverage Docker's layer caching
COPY package*.json ./

# Install only production dependencies to keep the runtime layer minimal
RUN npm install --omit=dev

# Copy the rest of your microservice source files
COPY . .

# ==========================================
# Stage 2: Distroless Secure Runtime
# ==========================================
FROM gcr.io/distroless/nodejs26-debian13

# Set the working execution directory inside the distroless container
WORKDIR /app

# Copy the pruned production dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the application source code from the build stage
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json

# Establish your IoT environmental defaults
ENV MQTT_TCP_URI=myMqttBrkr:1883
ENV RLDS_TCP_URI=myRlds:3006
ENV NODE_ENV=production

# Distroless has no shell, so specify the entrypoint array directly
CMD ["./src/app.js"]
