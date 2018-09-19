FROM node:10

ARG AUTH_SERVER_URL
ARG GAME_SERVER_URL
ARG GUI_SERVER_URL

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY angular.json ./

COPY ./src ./src

RUN apt-get update && apt-get install -y gettext
RUN envsubst < ./src/environments/environment.ts > ./src/environments/environment.ts

RUN npm install
RUN npm install -g @angular/cli@^6.2.1

EXPOSE 4200

CMD [ "npm", "start" ]
