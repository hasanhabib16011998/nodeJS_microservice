# Stage 1: Build dependencies and app in a full Node image
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Stage 2: Create a slim final image

FROM node:22-alpine

WORKDIR /usr/src/app

# Copy only the production node_modules and app from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./

EXPOSE 3001

CMD ["node", "src/server.js"]