# React Frontend Dockerfile
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the container
COPY package.json ./

# Install dependencies using npm
RUN npm --loglevel verbose install --legacy-peer-deps

# # Copy all source files into the container
COPY . . 

# Expose the application on port 3000
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"] 
