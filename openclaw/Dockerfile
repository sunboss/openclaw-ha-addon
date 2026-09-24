ARG BUILD_VERSION="2026.9.24.1"
ARG BUILD_FROM="node:22-bookworm-slim"

FROM ${BUILD_FROM}

ARG BUILD_VERSION
ARG BUILD_ARCH

USER root

ENV OPENCLAW_HOME=/config/.openclaw
ENV HOME=/config
ENV NODE_ENV=production

LABEL \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.type="app" \
  io.hass.name="OpenClaw" \
  io.hass.description="Personal AI Assistant for Home Assistant — multi-channel chats, skills & live Control UI." \
  io.hass.url="https://github.com/sunboss/hermes-agent-ha-addon" \
  io.hass.arch="aarch64|amd64"

# 1. 安装基础运行时与进程管理依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    tini \
    gosu \
    python3 \
    ca-certificates \
    curl \
    git && \
    rm -rf /var/lib/apt/lists/*

# 2. 全局安装 OpenClaw
RUN npm install -g openclaw@latest --omit=dev

# 3. 拷贝配置脚本、Nginx 反代与启动脚本
COPY --chmod=0755 scripts/ /opt/openclaw-ha-scripts/
COPY rootfs/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chmod=0755 run.sh /run.sh

ENTRYPOINT ["/usr/bin/tini", "--", "/run.sh"]
