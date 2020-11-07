FROM node:current-slim

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

RUN npm install express express-request-id jsonwebtoken mysql --save

COPY gulpfile.js .
RUN npm install --global gulp
RUN npm install --save-dev gulp-uglify
