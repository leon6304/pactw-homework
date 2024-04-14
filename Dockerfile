# Base image
FROM node:18.16.0
# Create app directory
RUN mkdir -p /usr/server/
WORKDIR /usr/server/
# Install app dependencies
COPY package.json /usr/server/
RUN npm install 
# Bundle app source
COPY . /usr/server/
CMD ["npm", "run", "pm2:start", "4"]