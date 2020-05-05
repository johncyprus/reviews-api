# Use official image as parent image
FROM node:13

# Set the working directory
WORKDIR /usr/src/app

# Copy the file from your host to your current location
COPY package.json .

# Run the command to install nodemon globally (allows for fresh version with each run)
RUN npm install --g nodemon

# Run the command inside image filesystem
RUN npm install

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Copy the rest of your app's source code from host to image filesystem
COPY . .

# Run the specified command within the container
CMD ["npm", "start"]
