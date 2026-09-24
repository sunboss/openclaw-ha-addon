# Operations Log

## [2026-09-24T01:40:00+08:00] init: 建立独立 OpenClaw HAOS Add-on 标准工程与专职 Bots 运维体系 (2026.9.24.1)
- **执行 Agent**：Hermes Agent
- **操作目标**：按照工业级标准新建独立的 OpenClaw Home Assistant OS 加载项工程，实现与 Hermes Agent 项目的完全解耦，供后续专门的 AI Bots 独立接管。
- **核心交付资产**：
  1. **加载项核心 (`openclaw/`)**：
     - `config.yaml` / `build.yaml`：配置 Ingress 8099、局域网 18789 直连端口、`addon_config:rw` 持久卷与模型参数；
     - `Dockerfile`：基于 `node:22-bookworm-slim`，集成 `nginx`、`tini`（作为 PID 1 自动收割僵尸进程）、`gosu` 与 `openclaw@latest`；
     - `rootfs/etc/nginx/nginx.conf`：双通道反向代理（8099 Ingress + 18789 LAN -> 18790 内部 Gateway）；
     - `scripts/configure.py`：自动将 HA 配置合并至 `/config/.openclaw/openclaw.json` 与 `.env`，保护已有技能与凭证不丢失；
     - `icon.png` / `logo.png`：专属绘制的高清龙虾（🦞）主题图标。
  2. **自动化构建 (`.github/workflows/`)**：
     - `build-images.yml`：支持 `aarch64` 与 `amd64` 双架构自动编译并推送到 `ghcr.io`；
     - `lint.yml`：自动对 Python 与 Bash 启动脚本进行语法校验。
  3. **专职 Bots 交接文档**：
     - `AGENTS.md`：跨 AI 协同基准与红线规范；
     - `docs/TROUBLESHOOTING.md` & `docs/HAOS_RUNBOOK.md`：现场诊断命令与 SOP。
- **关联归档**：`ops/history/20260924_014000_init_openclaw_ha_addon.json`
- **回滚点**：`git reset --hard d8e761a`
