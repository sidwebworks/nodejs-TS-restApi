FROM node:16

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY src ./src

COPY config ./config

COPY tsconfig.json .

RUN yarn build

CMD ["node", "build/src/app.js"]
