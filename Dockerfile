FROM rust:1.94-bookworm AS builder

WORKDIR /src
COPY Cargo.toml Cargo.lock ./
COPY crates ./crates
RUN cargo build --release --workspace

FROM node:24-bookworm-slim AS openclaw-package

ARG OPENCLAW_VERSION=2026.4.14

RUN npm config set fund false && npm config set audit false

WORKDIR /build/out
RUN set -eux; \
    tarball="$(npm pack --silent --pack-destination /build/out "openclaw@${OPENCLAW_VERSION}")"; \
    cp "/build/out/${tarball}" /build/openclaw.tgz

FROM node:24-bookworm-slim

ARG TARGETARCH
ARG OPENCLAW_VERSION=2026.4.14
ARG TTYD_VERSION=1.7.7
ARG BUILD_VERSION=dev
ARG BUILD_ARCH=amd64
ARG BUILD_DATE=unknown
ARG BUILD_REF=unknown
ENV ADDON_VERSION=${BUILD_VERSION}

LABEL \
  io.hass.type="addon" \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.arch="${BUILD_ARCH}" \
  io.hass.name="OpenClaw HA Add-on" \
  io.hass.description="Thin Home Assistant wrapper for the official OpenClaw runtime, with native HTTPS Gateway and maintenance Shell entrypoints." \
  org.opencontainers.image.title="OpenClaw HA Add-on" \
  org.opencontainers.image.description="Thin Home Assistant wrapper for the official OpenClaw runtime, with native HTTPS Gateway and maintenance Shell entrypoints." \
  org.opencontainers.image.version="${BUILD_VERSION}" \
  org.opencontainers.image.created="${BUILD_DATE}" \
  org.opencontainers.image.revision="${BUILD_REF}"

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    ca-certificates \
    curl \
    git \
    openssl \
    python3 \
    python3-pip \
    python3-venv \
    python-is-python3 \
    procps \
    iproute2 \
    tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    case "${TARGETARCH}" in \
      amd64) ttyd_arch="x86_64" ;; \
      aarch64|arm64) ttyd_arch="aarch64" ;; \
      *) echo "unsupported TARGETARCH for ttyd: ${TARGETARCH}"; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/tsl0922/ttyd/releases/download/${TTYD_VERSION}/ttyd.${ttyd_arch}" -o /usr/local/bin/ttyd; \
    chmod +x /usr/local/bin/ttyd

RUN npm config set fund false && npm config set audit false

COPY --from=openclaw-package /build/openclaw.tgz /tmp/openclaw.tgz
RUN npm install -g --omit=dev mcporter /tmp/openclaw.tgz

COPY --from=builder /src/target/release/addon-supervisor /usr/local/bin/addon-supervisor
COPY --from=builder /src/target/release/haos-ui /usr/local/bin/haos-ui
COPY --from=builder /src/target/release/ingressd /usr/local/bin/ingressd
COPY --from=builder /src/target/release/oc-config /usr/local/bin/oc-config

COPY config.yaml /etc/openclaw-addon-config.yaml

RUN mkdir -p /run/nginx /run/openclaw-rs/public /config

CMD ["addon-supervisor", "haos-entry"]
