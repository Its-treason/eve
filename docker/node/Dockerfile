FROM alpine:3.18 AS protoc-js

WORKDIR /tmp

RUN echo "@edge-testing https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
 && apk add --no-cache \
    bazel5@edge-testing \
    build-base \
    git \
 && git clone --branch v3.21.2 https://github.com/protocolbuffers/protobuf-javascript \
 && cd protobuf-javascript \
 && bazel build plugin_files \
 && install -o root -g root -m 0755 bazel-bin/generator/protoc-gen-js -t /tmp


FROM node:20.3-alpine AS base

RUN mkdir /app
WORKDIR /app

################################################################################
FROM base AS development

COPY --from=protoc-js /tmp/protoc-gen-js /usr/local/bin

ENV PYTHONUNBUFFERED=1
RUN apk add --no-cache --virtual .build-deps pango-dev jpeg-dev build-base cairo-dev giflib-dev python3 libsodium-dev libtool cmake g++ gcc ffmpeg-dev make git autoconf automake opus-dev libuv-dev protoc msttcorefonts-installer \
 && ln -sf python3 /usr/bin/python \
 && python3 -m ensurepip \
 && pip3 install --no-cache --upgrade pip setuptools \
 && update-ms-fonts \
 && fc-cache -f \
 && npm i -g nx

USER node

ENV APP_ENV=development
ENV NODE_ENV=development

################################################################################
FROM base AS build

COPY . /app

ENV PYTHONUNBUFFERED=1
RUN apk add --no-cache --virtual .build-deps pango-dev jpeg-dev build-base cairo-dev giflib-dev python3 libsodium-dev libtool cmake g++ gcc ffmpeg-dev make git autoconf automake opus-dev libuv-dev protoc msttcorefonts-installer \
 && ln -sf python3 /usr/bin/python \
 && python3 -m ensurepip \
 && pip3 install --no-cache --upgrade pip setuptools \
 && update-ms-fonts \
 && fc-cache -f \
 && rm -rf ./node_modules ./dist ./tmp \
# && npm i -g protoc-gen-js \
# Default network timeout is 30 sec, becase building for other arch is kinda slow the timeout hits to early.
# Setting the timeout to ~16 minutes / disableing it fixes this problem
 && yarn install --network-timeout 100000 \
 && npx nx run-many --target=build --configuration=production --all

ENV APP_ENV=production
ENV NODE_ENV=production

################################################################################
FROM base AS production

COPY --from=build --chown=1000:1000 /app /app
COPY --from=build /usr/share/fonts/truetype/msttcorefonts/Impact.ttf /usr/share/fonts/Impact.ttf
COPY --chmod=755 docker/node/entrypoint.sh /app/entrypoint.sh

RUN apk add --no-cache pango jpeg cairo giflib libsodium ffmpeg opus libuv \
 && fc-cache -f

USER node

ENV APP_ENV=production
ENV NODE_ENV=production

ENTRYPOINT ["/app/entrypoint.sh"]

