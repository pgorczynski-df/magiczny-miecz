FROM node:10

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY tsconfig.json ./
#RUN npm run-script build

RUN ls

EXPOSE 4200

CMD [ "ng", "serve" ]
