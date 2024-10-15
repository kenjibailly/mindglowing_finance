# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the files into the container
COPY ./web/app/ /app

# Install Gulp globally
RUN npm install -g gulp

# Install HBS
RUN npm install -g express-generator
RUN express --view=hbs

# Install nodemon
RUN npm install -g nodemon

# Install dependencies
RUN npm install
RUN npm install gulp

# Set the default command to run your bot
CMD ["npm", "start"]
