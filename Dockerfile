FROM node:18-alpine

WORKDIR /usr/app

COPY . .

RUN npm install
# RUN npm i -g ts-node

CMD [ "npm", "run", "start" ]
