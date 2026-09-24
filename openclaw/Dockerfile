ARG BUILD_FROM
FROM ${BUILD_FROM}

ARG BUILD_VERSION="2026.9.24.1"

USER root

ENV LANG=C.UTF-8 \
    OPENCLAW_HOME=/config/.openclaw \
    HOME=/config \
    NODE_ENV=production

LABEL \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.type="app" \
  io.hass.name="OpenClaw" \
  io.hass.description="Personal AI Assistant for Home Assistant — multi-channel chats, skills & live Control UI." \
  io.hass.url="https://github.com/sunboss/openclaw-ha-addon" \
  io.hass.arch="aarch64|amd64"

# 自适应安装依赖（自动判断 Alpine apk 或 Debian apt，优先使用国内镜像源加速）
RUN if command -v apk >/dev/null 2>&1; then \
        sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories 2>/dev/null || true; \
        apk update --no-cache && \
        apk add --no-cache bash curl jq ca-certificates nginx tini python3 nodejs npm sqlite-libs su-exec && \
        ln -sf /sbin/tini /usr/bin/tini || true; \
        adduser -u 1000 -D -s /bin/sh node 2>/dev/null || true; \
    else \
        apt-get update && apt-get install -y --no-install-recommends \
        nginx tini gosu python3 ca-certificates curl git nodejs npm && \
        rm -rf /var/lib/apt/lists/*; \
    fi

# 全局安装 openclaw CLI（通过 npmmirror 国内极速源）
RUN npm install -g openclaw@latest --registry=https://registry.npmmirror.com

# 拷贝配置脚本、Nginx 反代与启动脚本
COPY --chmod=0755 scripts/ /opt/openclaw-ha-scripts/
COPY rootfs/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chmod=0755 run.sh /run.sh

ENTRYPOINT ["/usr/bin/tini", "--", "/run.sh"]
