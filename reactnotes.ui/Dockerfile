# Use an official Node.js image as the build environment
FROM node:16-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app's code to the container
COPY . .

# Build the React app for production
RUN npm run build || echo "Build failed"

# Debugging: List the contents of /app after the build
RUN echo "Contents of /app directory:" && ls -la /app

# Use a lightweight Nginx image to serve the production build
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
