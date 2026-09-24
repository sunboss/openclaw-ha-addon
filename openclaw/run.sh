#!/usr/bin/env bash
# OpenClaw Home Assistant Add-on Entrypoint.
#
# Architecture:
#   tini (PID 1)
#     ├─> nginx (8099 Ingress + 18789 LAN)
#     └─> openclaw gateway (127.0.0.1:18790)

set -euo pipefail

export CONFIG_PATH=/data/options.json
export ADDON_STATE_ROOT=/config
export OPENCLAW_HOME="${ADDON_STATE_ROOT}/.openclaw"
export HOME="${ADDON_STATE_ROOT}"

mkdir -p /data "${ADDON_STATE_ROOT}" "${OPENCLAW_HOME}"

# ── 权限处理与首次配置渲染 ───────────────────────────────────────────────
if [ "$(id -u)" = "0" ] && [ "${OPENCLAW_PRIVILEGE_DROPPED:-}" != "1" ]; then
  python3 /opt/openclaw-ha-scripts/configure.py

  chown -R node:node "${ADDON_STATE_ROOT}" /tmp/nginx_* 2>/dev/null || true

  export OPENCLAW_PRIVILEGE_DROPPED=1
  export OPENCLAW_CONFIGURED=1
  echo "[run.sh] Dropping privileges to node user (OPENCLAW_HOME=${OPENCLAW_HOME})..."
  if command -v gosu >/dev/null 2>&1; then
    exec gosu node "$0" "$@"
  fi
  for candidate in /command/s6-setuidgid /usr/bin/s6-setuidgid /bin/s6-setuidgid; do
    if [ -x "${candidate}" ]; then
      exec "${candidate}" node "$0" "$@"
    fi
  done
fi

if [ "${OPENCLAW_CONFIGURED:-}" != "1" ]; then
  python3 /opt/openclaw-ha-scripts/configure.py
fi

# ── 加载持久化环境变量 ───────────────────────────────────────────────────
if [ -f "${OPENCLAW_HOME}/.env" ]; then
  set -a
  . "${OPENCLAW_HOME}/.env"
  set +a
fi

# ── 启动 Nginx（Ingress 8099 + LAN 18789）────────────────────────────────
echo "[run.sh] Starting nginx (Ingress :8099, LAN :18789)..."
mkdir -p /tmp/nginx_client_body /tmp/nginx_proxy_temp /tmp/nginx_fastcgi_temp /tmp/nginx_uwsgi_temp /tmp/nginx_scgi_temp 2>/dev/null || true
touch /tmp/nginx_error.log /tmp/nginx_access.log 2>/dev/null || true
nginx -c /etc/nginx/nginx.conf &
NGINX_PID=$!
sleep 0.5
if ! kill -0 "${NGINX_PID}" 2>/dev/null; then
  echo "[run.sh] ERROR: nginx failed to start; error log:" >&2
  cat /tmp/nginx_error.log >&2 || true
else
  echo "[run.sh] nginx started (PID ${NGINX_PID})"
  tail -F /tmp/nginx_error.log &
fi

# ── 启动 OpenClaw Gateway（前台运行，监听 127.0.0.1:18790）───────────────
echo "[run.sh] Starting OpenClaw Gateway (OPENCLAW_HOME=${OPENCLAW_HOME})..."
cd "${OPENCLAW_HOME}"
exec openclaw gateway --port 18790 --verbose
