# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Command to run the application in production mode
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
