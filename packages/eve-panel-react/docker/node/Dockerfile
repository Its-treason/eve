FROM node:16.14.0-alpine AS base

RUN mkdir /app

WORKDIR /app

FROM base AS development

ENV NODE_ENV=development
ENV APP_ENV=development

FROM base AS production

COPY . /app

RUN rm -rf node_modules .swc \
    && npm i \
    && npm run build

ENV NODE_ENV=production
ENV APP_ENV=production
