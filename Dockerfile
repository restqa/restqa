  
# The instructions for the first stage
FROM node:12-alpine as builder
LABEL maintainer="RestQa <team@restqa.io>"
LABEL app="restqa"
LABEL name="restqa"
LABEL description="An all in one test automation runner"
LABEL repository="https://github.com/restqa/restqa"
LABEL url="https://restqa.io/restqa"

RUN apk --no-cache add python make g++

COPY package*.json ./
COPY editor/client ./editor/client


RUN npm install --production
RUN npm ci --only=production

RUN npm run editor:install
RUN npm run editor:build


# The instructions for second stage
FROM node:12-alpine

WORKDIR /restqa
RUN mkdir -p editor/client/dist
COPY --from=builder node_modules node_modules

ENV NODE_ENV=production


COPY . .
COPY --from=builder editor editor

RUN ln -s /restqa/bin/restqa /usr/bin/restqa

WORKDIR /app

CMD ["restqa", "run"]
