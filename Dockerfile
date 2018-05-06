FROM node:9

WORKDIR /starter
ENV NODE_ENV production

COPY package.json /starter/package.json

RUN npm install --production

COPY .env.example /starter/.env.example
COPY . /starter

CMD ["npm","start"]

EXPOSE 8080
