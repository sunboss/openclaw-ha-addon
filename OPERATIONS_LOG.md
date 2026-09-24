# Operations Log

## [2026-09-24T22:40:00+08:00] deploy: OpenClaw 加载项正式部署上线与双通道验证成功 (2026.9.24.1)
- **执行 Agent**：Hermes Agent
- **操作目标**：部署、排查并上线 `local_openclaw` (v2026.9.24.1) 至 HAOS 宿主机 (`192.168.1.66`)
- **执行动作**：
  1. 通过 HA Supervisor 官方编译器完成 `local/aarch64-addon-openclaw:2026.9.24.1` 镜像构建；
  2. 修复 Alpine 环境下 `tini` 路径映射与降权兼容；
  3. 修正 OpenClaw 2026.9 核心配置 Schema（`gateway.auth` 结构化对象、`trustedProxies` 反代白名单、移除废弃键）；
  4. 启动并验证加载项双通道服务。
- **真实返回验证**：
  - `app_local_openclaw` 稳定运行；
  - LAN 原生通道：`0.0.0.0:18789` -> Nginx -> Gateway；
  - Ingress 通道：`0.0.0.0:8099` -> Nginx -> Gateway；
  - 核心网关进程：`0.0.0.0:18790`（`openclaw-gateway` PID 7，ready 状态，心跳正常，加载全部 10+ 插件）。
- **关联归档**：`ops/history/20260924_224000_openclaw_deploy_success.json`
- **下阶段接入**：专职 OpenClaw Bots 按照 `AGENTS.md` 接管日常技能扩展与多渠道对接。

---

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
