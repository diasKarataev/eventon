FROM node:18.18.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN mkdir uploads

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
