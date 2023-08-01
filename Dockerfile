# Stage 1: Build the Vite React app
FROM node:lts-alpine as build

WORKDIR /app

# Copy the package.json and package-lock.json or yarn.lock to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Remove the default Nginx configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy the built app from the previous stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
