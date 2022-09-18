# The instructions for the first stage
FROM node:16-alpine

ARG RESTQA_VERSION

LABEL maintainer="RestQa <team@restqa.io>"
LABEL app="restqa"
LABEL name="restqa"
LABEL description="An all in one test automation runner"
LABEL repository="https://github.com/restqa/restqa"
LABEL url="https://restqa.io/restqa"

RUN npm install -g @restqa/restqa@$RESTQA_VERSION

WORKDIR /app/

CMD ["restqa", "run"]
