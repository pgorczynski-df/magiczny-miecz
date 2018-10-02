FROM node:10

ARG AUTH_SERVER_URL
ARG GAME_SERVER_URL
ARG GUI_SERVER_URL

WORKDIR /app

COPY ./MagicSword.Core.Web/ClientApp/package*.json ./
COPY ./MagicSword.Core.Web/ClientApp/tsconfig.json ./
COPY ./MagicSword.Core.Web/ClientApp/angular.json ./
COPY ./MagicSword.Core.Web/ClientApp/src ./src

COPY ./MagicSword.Core.Logic/ClientApp/src/app/common/ ./src/app/common

RUN sed -i 's/\/..\/..\/..\/MagicSword.Core.Logic\/ClientApp\/src//' ./tsconfig.json

RUN apt-get update && apt-get install -y gettext
RUN envsubst < ./src/environments/environment.ts > ./src/environments/environment.ts.tmp && mv ./src/environments/environment.ts.tmp ./src/environments/environment.ts

RUN npm install
RUN npm install -g @angular/cli@^6.2.1

EXPOSE 4200

CMD [ "npm", "start" ]
