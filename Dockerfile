FROM nginx:alpine AS base
EXPOSE 80
WORKDIR /app

FROM node:20 as build
WORKDIR /src

# Copy package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci

# Copy the app
COPY . .

# Build the app
RUN npm run build

FROM base AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /src/.vitepress/dist .