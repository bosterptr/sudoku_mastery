# syntax=docker/dockerfile:1
ARG RUST_VERSION=1.76.0
ARG APP_NAME=sudoku_service
# xx is a helper for cross-compilation.
# See https://github.com/tonistiigi/xx/ for more information.
FROM --platform=$BUILDPLATFORM tonistiigi/xx:1.4.0 AS xx
FROM --platform=$BUILDPLATFORM rust:${RUST_VERSION} AS build
ARG APP_NAME
WORKDIR /app
ENV SQLX_OFFLINE=true
COPY --from=xx / /.
RUN apt-get update && apt-get install -y \
    bash \
    build-essential \
    clang \
    file \
    g++ \
    musl-dev \
    gcc \
    git \
    libc-dev \
    libprotobuf-dev \
    librdkafka-dev \
    libssl-dev \
    lld \
    musl-tools \
    openssl \
    pkg-config \
    protobuf-compiler \
    python3 \
    python3-pip \
    valgrind \
    zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*
ARG TARGETPLATFORM
# Install cross compilation build dependencies.
RUN --mount=type=bind,source=src,target=src \
    --mount=type=bind,source=Cargo.toml,target=Cargo.toml \
    --mount=type=bind,source=build.rs,target=build.rs \
    --mount=type=bind,source=migrations,target=migrations \
    --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
    --mount=type=bind,source=sqlx-data.json,target=sqlx-data.json \
    --mount=type=cache,target=/app/target/,id=rust-cache-${APP_NAME}-${TARGETPLATFORM} \
    --mount=type=cache,target=/usr/local/cargo/git/db \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
xx-cargo build --locked --release --target-dir ./target && \
cp ./target/$(xx-cargo --print-target-triple)/release/$APP_NAME /bin/server && \
xx-verify /bin/server

FROM debian:bookworm-slim AS final

# RUN apt-get update && apt-get install -y \
#     protobuf-compiler \
#     libprotobuf-dev \
#     librdkafka-dev \
#     libssl-dev \
#     openssl \
#     && rm -rf /var/lib/apt/lists/*
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser
COPY --from=build /bin/server /bin/
USER appuser
EXPOSE 5000
CMD ["/bin/server"]