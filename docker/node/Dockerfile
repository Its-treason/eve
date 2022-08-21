FROM node:18.7.0-alpine AS base

RUN mkdir /app
WORKDIR /app

################################################################################
FROM base AS development

ENV PYTHONUNBUFFERED=1
RUN apk add --no-cache --virtual .build-deps pango-dev jpeg-dev build-base g++ cairo-dev giflib-dev python3 libsodium-dev libtool cmake g++ gcc ffmpeg-dev make git autoconf automake opus-dev libuv-dev protoc msttcorefonts-installer \
 && ln -sf python3 /usr/bin/python \
 && python3 -m ensurepip \
 && pip3 install --no-cache --upgrade pip setuptools
 && update-ms-fonts
 && fc-cache -f

ENV APP_ENV=development
ENV NODE_ENV=development

################################################################################
FROM base AS production

COPY . /app

RUN rm -rf ./node_modules ./packages/react/node_modules ./dist ./packages/react/dist \
 && yarn install \
 && npx nx run-many --target=build --configuration=production --all \
 && rm -rf ./node_modules \
 && yarn install --prod

ENV APP_ENV=production
ENV NODE_ENV=production
