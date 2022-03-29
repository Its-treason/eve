FROM node:16.14.0-buster AS base

RUN mkdir /app

RUN apt update \
    && apt install libsodium-dev libtool protobuf-compiler cmake g++ gcc libuv1-dev libopus-dev libavcodec-dev libavcodec58 libavformat-dev libavformat58 libavutil-dev libavutil56 libavfilter7 libavfilter-dev libswresample-dev libswresample3 -y \
    && apt install chromium --no-install-recommends -y \
    && apt clean

FROM base AS development

WORKDIR /app

FROM base AS production

WORKDIR /app

COPY . /app

RUN rm -rf /app/node_modules
RUN npm i
RUN sed -i 's/"noEmit": true/"noEmit": false/g' tsconfig.json
RUN npm run build
