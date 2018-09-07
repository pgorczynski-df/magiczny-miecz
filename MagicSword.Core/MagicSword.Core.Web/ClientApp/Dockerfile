FROM node:10

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY tsconfig.json ./
COPY angular.json ./

RUN npm install -g @angular/cli@^6.2.1

EXPOSE 4200

CMD [ "npm", "start" ]
