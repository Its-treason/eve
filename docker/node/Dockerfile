FROM node:18.4.0-alpine AS base

RUN mkdir /app
WORKDIR /app

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
    && npx lerna bootstrap
