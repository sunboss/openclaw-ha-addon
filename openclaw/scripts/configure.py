#!/usr/bin/env python3
"""Render OpenClaw runtime configuration from Home Assistant add-on options.

Invoked from run.sh on every container start. Reads /data/options.json,
merges it with persistent state under /config/.openclaw, and writes:
  /config/.openclaw/.env
  /config/.openclaw/openclaw.json
"""

from __future__ import annotations
import json
import os
from pathlib import Path


def load_options() -> dict:
    p = Path("/data/options.json")
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def main() -> int:
    options = load_options()

    state_root = Path(os.environ.get("ADDON_STATE_ROOT", "/config"))
    openclaw_home = Path(os.environ.get("OPENCLAW_HOME", "/config/.openclaw"))

    state_root.mkdir(parents=True, exist_ok=True)
    openclaw_home.mkdir(parents=True, exist_ok=True)
    for sub in ("workspace", "skills", "sessions", "credentials"):
        (openclaw_home / sub).mkdir(parents=True, exist_ok=True)

    token = options.get("gateway_token") or "openclaw-ha-addon-persistent-token-v1"

    # 1. 渲染持久化环境变量 .env
    env_path = openclaw_home / ".env"
    env_lines = [
        f"OPENCLAW_HOME={openclaw_home}",
        f"OPENCLAW_GATEWAY_PORT=18790",
        f"OPENCLAW_GATEWAY_TOKEN={token}",
    ]

    base_url = options.get("openai_base_url") or "https://api.1234r.com/v1"
    api_key = options.get("openai_api_key") or ""
    model = options.get("llm_model") or "claude-3-7-sonnet"

    if api_key:
        env_lines.append(f"OPENAI_API_KEY={api_key}")
    if base_url:
        env_lines.append(f"OPENAI_BASE_URL={base_url}")
    if model:
        env_lines.append(f"OPENCLAW_MODEL={model}")
    if options.get("telegram_bot_token"):
        env_lines.append(f"TELEGRAM_BOT_TOKEN={options.get('telegram_bot_token')}")
    if options.get("discord_bot_token"):
        env_lines.append(f"DISCORD_BOT_TOKEN={options.get('discord_bot_token')}")

    env_path.write_text("\n".join(env_lines) + "\n", encoding="utf-8")

    # 2. 渲染 openclaw.json 核心配置 (符合 OpenClaw 2026.9 Schema)
    cfg_path = openclaw_home / "openclaw.json"
    cfg = {}
    if cfg_path.exists():
        try:
            cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
        except Exception:
            cfg = {}

    # 移除不兼容的旧键
    cfg.pop("model", None)

    gateway_cfg = cfg.get("gateway") or {}
    gateway_cfg["mode"] = "local"
    gateway_cfg["bind"] = "lan"
    gateway_cfg["port"] = 18790
    gateway_cfg["auth"] = {
        "mode": "token",
        "token": token,
    }

    gateway_cfg["trustedProxies"] = ["127.0.0.1", "::1", "172.30.32.0/23", "172.17.0.0/16"]

    control_ui = gateway_cfg.get("controlUi") or {}
    control_ui["allowedOrigins"] = [
        "http://127.0.0.1:18790",
        "http://localhost:18790",
        "http://127.0.0.1:18789",
        "http://localhost:18789",
        "http://127.0.0.1:8099",
        "http://localhost:8099",
        "http://192.168.1.66:18789",
        "http://192.168.1.66:8123",
    ]
    gateway_cfg["controlUi"] = control_ui
    cfg["gateway"] = gateway_cfg

    cfg_path.write_text(json.dumps(cfg, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[configure.py] Successfully rendered OpenClaw config to {cfg_path}")
    return 0


if __name__ == "__main__":
    main()
