# Use Node.js 20-alpine as the lightweight base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker's layer caching
# This ensures npm install only runs if package files change
COPY package*.json ./

# Install only production dependencies for a smaller image
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port the backend runs on
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
