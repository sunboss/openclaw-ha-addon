FROM rust:1.94-bookworm AS rust-builder

ARG BUILD_REF=unknown
WORKDIR /src
COPY Cargo.toml Cargo.lock ./
COPY crates ./crates
RUN printf '%s\n' "${BUILD_REF}" > /src/.build-ref
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git/db,sharing=locked \
    cargo build --release --workspace

FROM oven/bun:1.2.18 AS bun-bin

FROM node:24-bookworm AS openclaw-builder
ARG OPENCLAW_VERSION=2026.8.1

COPY --from=bun-bin /usr/local/bin/bun /usr/local/bin/bun

ENV OPENCLAW_PREFER_PNPM=1

RUN corepack enable

RUN node -e 'const [M,m]=process.versions.node.split(".").map(Number); const ok=(M===24&&m>=15)||(M===25&&m>=9)||(M===22&&m>=22); if(!ok){throw new Error(`OpenClaw ${process.env.OPENCLAW_VERSION || "runtime"} requires Node >=22.22.3 <23 || >=24.15.0 <25 || >=25.9.0; found ${process.versions.node}`)}'

WORKDIR /opt/openclaw
ADD https://github.com/openclaw/openclaw/archive/refs/tags/v${OPENCLAW_VERSION}.tar.gz /tmp/openclaw.tar.gz
RUN tar -xzf /tmp/openclaw.tar.gz --strip-components=1 -C /opt/openclaw && rm /tmp/openclaw.tar.gz

RUN test -f package.json && test -f pnpm-lock.yaml && test -f openclaw.mjs

RUN --mount=type=cache,id=openclaw-pnpm-store,target=/root/.local/share/pnpm/store,sharing=locked \
    NODE_OPTIONS=--max-old-space-size=2048 pnpm install --prefer-offline --frozen-lockfile

RUN pnpm canvas:a2ui:bundle || \
    (echo "A2UI bundle: creating stub (non-fatal)" && \
     mkdir -p src/canvas-host/a2ui && \
     echo "/* A2UI bundle unavailable in this build */" > src/canvas-host/a2ui/a2ui.bundle.js && \
     echo "stub" > src/canvas-host/a2ui/.bundle.hash && \
     rm -rf vendor/a2ui apps/shared/OpenClawKit/Tools/CanvasA2UI)

RUN pnpm build:docker && pnpm ui:build

RUN rm -rf node_modules && \
    CI=true NPM_CONFIG_FROZEN_LOCKFILE=false pnpm install --prod --no-frozen-lockfile --ignore-scripts && \
    node scripts/postinstall-bundled-plugins.mjs && \
    pnpm --dir dist/extensions/browser install --prod --no-frozen-lockfile --ignore-scripts && \
    find dist -type f \( -name '*.d.ts' -o -name '*.d.mts' -o -name '*.d.cts' -o -name '*.map' \) -delete

FROM node:24-bookworm-slim

ARG TARGETARCH
ARG OPENCLAW_VERSION=2026.8.1
ARG TTYD_VERSION=1.7.7
ARG BUILD_VERSION=dev
ARG BUILD_ARCH=amd64
ARG BUILD_DATE=unknown
ARG BUILD_REF=unknown
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

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
    xvfb \
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

WORKDIR /opt/openclaw

COPY --from=openclaw-builder /opt/openclaw/dist ./dist
COPY --from=openclaw-builder /opt/openclaw/node_modules ./node_modules
COPY --from=openclaw-builder /opt/openclaw/package.json ./package.json
COPY --from=openclaw-builder /opt/openclaw/openclaw.mjs ./openclaw.mjs
COPY --from=openclaw-builder /opt/openclaw/extensions ./extensions
COPY --from=openclaw-builder /opt/openclaw/skills ./skills
COPY --from=openclaw-builder /opt/openclaw/docs/reference/templates ./docs/reference/templates

RUN test -f /opt/openclaw/docs/reference/templates/AGENTS.md && \
    test -f /opt/openclaw/docs/reference/templates/SOUL.md && \
    test -f /opt/openclaw/docs/reference/templates/TOOLS.md && \
    test -f /opt/openclaw/docs/reference/templates/IDENTITY.md && \
    test -f /opt/openclaw/docs/reference/templates/USER.md && \
    test -f /opt/openclaw/docs/reference/templates/HEARTBEAT.md && \
    test -f /opt/openclaw/docs/reference/templates/BOOTSTRAP.md

RUN ln -sf /opt/openclaw/openclaw.mjs /usr/local/bin/openclaw && \
    chmod 755 /opt/openclaw/openclaw.mjs

RUN mkdir -p "$PLAYWRIGHT_BROWSERS_PATH" && \
    node /opt/openclaw/node_modules/playwright-core/cli.js install --with-deps chromium && \
    chmod -R a+rX "$PLAYWRIGHT_BROWSERS_PATH"

COPY --from=rust-builder /src/target/release/addon-supervisor /usr/local/bin/addon-supervisor
COPY --from=rust-builder /src/target/release/haos-ui /usr/local/bin/haos-ui
COPY --from=rust-builder /src/target/release/ingressd /usr/local/bin/ingressd
COPY --from=rust-builder /src/target/release/oc-config /usr/local/bin/oc-config

RUN ! grep -aFq '/opt/openclaw/src/agents/templates/HEARTBEAT.md' /usr/local/bin/addon-supervisor

COPY config.yaml /etc/openclaw-addon-config.yaml

RUN mkdir -p /run/nginx /run/openclaw-rs/public /config

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

CMD ["addon-supervisor", "haos-entry"]
