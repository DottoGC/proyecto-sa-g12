FROM node:12
WORKDIR /app
COPY /app/package.json /
RUN npm install
COPY . /
EXPOSE 3000
CMD ["npm","start"]