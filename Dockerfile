FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ENV MONGODB_URI "mongodb://mongo:27017"

RUN npm install

COPY . ./

#RUN npm run build

CMD ["npm", "run", "dev"]
