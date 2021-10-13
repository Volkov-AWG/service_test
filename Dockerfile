FROM node:12.13.1-alpine3.9

ENV WORKING_DIRECTORY=/usr/src \
  NPM_CONFIG_LOGLEVEL="error" \
  NPM_CONFIG_REGISTRY="https://art.lmru.tech/api/npm/npm-lego-front/"

WORKDIR ${WORKING_DIRECTORY}

COPY package*.json ${WORKING_DIRECTORY}/

RUN echo "https://art.lmru.tech/apk-remote-alpine/v3.9/main" >> /etc/apk/repositories && \
  apk add --no-cache --virtual build-dependencies build-base bash git python ca-certificates wget && \
  wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
  wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
  apk add glibc-2.29-r0.apk && \
  npm install -g mocha && \
  npm ci

COPY . .

RUN chmod +x run-tests.sh
ENTRYPOINT ["./run-tests.sh"]
