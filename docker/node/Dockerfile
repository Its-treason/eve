FROM node:18.4.0-alpine AS base

RUN mkdir /app
WORKDIR /app

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN apk add libsodium-dev libtool cmake g++ gcc ffmpeg-dev chromium make git autoconf automake opus-dev libuv-dev protoc

USER 1000:1000

ENTRYPOINT ["yarn", "run"]

FROM base AS development

ENV APP_ENV=development
ENV NODE_ENV=development

FROM base AS production

COPY . /app

RUN rm -rf /build/node_modules \
    && yarn install \
    && npx lerna bootstrap \
    && npx lerna run build

ENV APP_ENV=production
ENV NODE_ENV=production

# Delete all dependencies and just install production deps
RUN npx lerna exec -- rm -rf ./node_modules \
    && npx lerna bootstrap --production
