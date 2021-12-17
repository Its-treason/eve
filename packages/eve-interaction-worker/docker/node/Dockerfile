FROM node:16.7.0-buster AS base

RUN mkdir /app

RUN apt update \
    && apt install chromium ffmpeg --no-install-recommends -y \
    && apt clean

RUN wget -q -O "/usr/bin/youtube-dl" "https://github.com/ytdl-org/youtube-dl/releases/download/2021.12.17/youtube-dl" \
    && chmod +x /usr/bin/youtube-dl

FROM base AS development

WORKDIR /app

FROM base AS production

RUN mkdir /build
COPY . /build

WORKDIR /build

RUN rm -rf /build/node_modules \
    && npm i \
    && sed -i 's/"noEmit": true/"noEmit": false/g' tsconfig.json \
    && npm run build \
    && mv /build/build /app/ \
    && rm -rf /build/*

COPY . /build

RUN rm -rf /build/node_modules \
    && npm i --only=prod \
    && mv /build/node_modules /app/ \
    && rm -rf /build

WORKDIR /app
