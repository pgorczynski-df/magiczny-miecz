FROM node:10

ARG AUTH_SERVER_URL
ARG GAME_SERVER_URL
ARG GUI_SERVER_URL

WORKDIR /app

#RUN printenv
#https://stackoverflow.com/questions/48595829/how-to-pass-environment-variables-to-a-frontend-web-application/49349963
#https://docs.docker.com/compose/compose-file/#args

COPY package*.json ./
COPY tsconfig.json ./
COPY angular.json ./

COPY ./src ./src

RUN apt-get update && apt-get install -y gettext
RUN envsubst < ./src/environments/environment.prod.ts

RUN npm install
RUN npm install -g @angular/cli@^6.2.1

EXPOSE 4200

CMD [ "npm", "start", "--prod" ]
