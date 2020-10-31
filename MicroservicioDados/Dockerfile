FROM node:current-slim

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

RUN npm install express express-request-id jsonwebtoken --save

EXPOSE 8080

CMD ["npm","run","start"]

COPY . .
