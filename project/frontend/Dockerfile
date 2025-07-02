FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_ENV=production

COPY package*.json ./
RUN npm install
COPY . .

# Copy the appropriate env file based on build arg
RUN if [ "$VITE_ENV" = "development" ]; then cp .env.dev .env; else cp .env.prod .env; fi

RUN npm run build