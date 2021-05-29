  
# The instructions for the first stage
FROM node:12  as builder
LABEL maintainer="RestQa <team@restqa.io>"
LABEL app="restqa"
LABEL name="restqa"
LABEL description="An all in one test automation runner"
LABEL repository="https://github.com/restqa/restqa"
LABEL url="https://restqa.io/restqa"


COPY package*.json ./

RUN npm install --production
RUN npm ci --only=production

COPY dashboard ./dashboard
RUN npm install -g @vue/cli-service
RUN npm run dashboard:install
RUN npm run dashboard:build

# The instructions for second stage
FROM node:12-alpine

WORKDIR /restqa


COPY --from=builder node_modules node_modules

ENV NODE_ENV=production


RUN mkdir -p dashboard/dist 
COPY --from=builder dashboard/dist dashboard/dist
COPY bin ./bin
COPY example ./example
COPY src ./src
COPY package.json .

RUN ln -s /restqa/bin/restqa /usr/bin/restqa

WORKDIR /app

CMD ["restqa", "run"]
