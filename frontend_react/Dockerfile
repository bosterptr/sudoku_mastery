ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
FROM base as deps
COPY ./sudoku_wasm/pkg ../sudoku_wasm/pkg
COPY ./frontend_react .
RUN --mount=type=bind,source=./frontend_react/package.json,target=package.json \
    --mount=type=bind,source=./frontend_react/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=./sudoku_wasm/pkg,target=/usr/src/sudoku_wasm/pkg \
    npm ci --omit=dev

FROM deps as build
WORKDIR /usr/src/app
RUN --mount=type=bind,source=./frontend_react/package.json,target=package.json \
    --mount=type=bind,source=./frontend_react/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=./sudoku_wasm/pkg,target=/usr/src/sudoku_wasm/pkg \
    npm ci

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
