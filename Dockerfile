FROM nginx:alpine AS base
EXPOSE 80
WORKDIR /app

FROM node:18 as build
WORKDIR /src

# Copy package.json and yarn lock 
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the app
COPY . .

# Build the app
RUN yarn build

FROM base AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /src/.vitepress/dist .