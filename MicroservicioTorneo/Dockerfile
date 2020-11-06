FROM node:current-slim

WORKDIR C:\\Users\\Moino\\Documents\\2do2020\\Sa\\proyectosa

COPY package.json .

RUN npm install

RUN npm install express body-parser mysql jsonwebtoken axios --save

EXPOSE 3000

CMD ["npm","run","start"]

COPY . .