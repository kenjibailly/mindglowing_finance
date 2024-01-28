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

# Install supervisord
RUN apt-get update && apt-get install -y supervisor

# Create supervisor configuration file
COPY ./web/config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
