FROM node:21.7-alpine AS base
# RUN apk add --no-cache \
#   build-base \
#   gcc \
#   g++ \
#   make
WORKDIR /usr/src/app
# RUN npm audit
COPY --chown=node:node ./auth_service/package*.json ./
COPY --chown=node:node ./auth_service/tsconfig.json ./
RUN --mount=type=bind,source=./eventbus/events/clients/ts,target=/usr/src/eventbus/events/clients/ts \
    --mount=type=cache,target=/root/.npm \
    npm ci
# COPY --chown=node:node ./auth_service/ ./ 
RUN --mount=type=bind,source=./auth_service/package.json,target=package.json \
    --mount=type=bind,source=./auth_service/package-lock.json,target=package-lock.json \
    --mount=type=bind,source=./auth_service/src,target=src \
    --mount=type=bind,source=./auth_service/tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=./eventbus/events/clients/ts,target=/usr/src/eventbus/events/clients/ts \
    --mount=type=cache,target=/root/.npm \
    npm run build
RUN npm prune --production

# # ---- Test ----
# # FROM base as test
# # COPY ./ ./
# # RUN npm run lint
# # RUN npm run test

# # ---- Release ----
FROM node:21.7-alpine as production
WORKDIR /usr/src/app
COPY --chown=node:node --from=base ./usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=base ./usr/src/app/package.json ./
COPY --chown=node:node --from=base ./usr/src/app/dist ./dist
# RUN mkdir -p ./dist/mq/proto
COPY --chown=node:node ./eventbus/events/clients/ts /usr/src/eventbus/events/clients/ts
# RUN mkdir logs
# RUN touch logs/combined.log logs/error.log
USER node
CMD ["node", "dist/index.js"]
