FROM node:10

ARG AUTH_SERVER_URL

WORKDIR /app

#RUN printenv
#https://stackoverflow.com/questions/48595829/how-to-pass-environment-variables-to-a-frontend-web-application/49349963
#https://docs.docker.com/compose/compose-file/#args

COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY tsconfig.json ./
COPY angular.json ./

RUN npm install -g @angular/cli@^6.2.1

EXPOSE 4200

CMD [ "npm", "start" ]
