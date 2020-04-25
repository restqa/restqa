  
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
RUN npm install --production
RUN npm ci --only=production


# The instructions for second stage
FROM node:12-alpine

WORKDIR /restqa
COPY --from=builder node_modules node_modules

ENV NODE_ENV=production

COPY . .
RUN ln -s /restqa/bin/restqa /usr/bin/restqa

WORKDIR /app

CMD ["restqa", "run"]
