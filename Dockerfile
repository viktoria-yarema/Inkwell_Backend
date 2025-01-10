# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Expose the port your app runs on (default is 8080 for Google Cloud Run)
EXPOSE 8080

# Command to run the app
CMD ["node", "server.js"]
