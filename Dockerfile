FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN apk add  --no-cache ffmpeg

CMD [ "npm", "start" ]
