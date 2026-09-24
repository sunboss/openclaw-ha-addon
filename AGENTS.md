# OpenClaw HA Add-on 专职 Agent 接入与运维手册 (AGENTS.md)

> 本文件供接手本项目的专职 AI Agent（Claude Code、Codex、Antigravity、OpenClaw Bot 等）阅读，用于秒级理解项目架构、操作红线与维护规范。

---

## 一、项目核心档案

- **项目根目录**：`/Users/sunboss/Desktop/openclaw-ha-addon`
- **加载项目录**：`openclaw/`
- **目标平台**：Home Assistant OS (HAOS) 2026+
- **架构方案**：
  - 进程治理：`tini` (PID 1) -> `run.sh` -> `nginx` (8099 Ingress + 18789 LAN) + `openclaw gateway` (127.0.0.1:18790)
  - 持久化目录：`/config/.openclaw/`（物理绑定宿主机持久存储）
  - 核心配置文件：`/config/.openclaw/openclaw.json` 与 `.env`

---

## 二、关键操作红线（严禁触犯）

1. **严禁修改 HAOS 核心代码**：任何情况下只修改本工程代码或加载项配置，严禁侵入式修改宿主机或 HA 核心代码；
2. **操作免确认范围**：登录服务器、只读查询排查、查看日志、测试连通性等只读操作严禁询问用户，直接执行并实时中文播报；
3. **敏感凭据安全**：日志与摘要中严禁明文出现 API keys、token、密码等，一律替换为 `[REDACTED]`；
4. **数据持久化必须保障**：任何配置、更新或补丁必须严格维持 `/config/.openclaw` 的持久性，升级镜像时绝不可覆盖用户数据。

---

## 三、文件结构索引

- `openclaw/config.yaml`: 加载项元数据、Ingress 配置与 options/schema 定义
- `openclaw/Dockerfile`: 基于 Node.js LTS，集成 nginx + tini
- `openclaw/run.sh`: 权限降级与服务拉起
- `openclaw/rootfs/etc/nginx/nginx.conf`: 8099 与 18789 反向代理配置
- `openclaw/scripts/configure.py`: options.json 解析与增量合并
- `openclaw/DOCS.md` / `CHANGELOG.md` / `translations/`: 多语言与用户文档
