# Changelog / 更新日志

## [2026.9.24.1] - 2026-09-24
- **首发版本发布**：
  1. 对齐 Node-RED / Hermes 标准架构，支持 Home Assistant Ingress 8099 与局域网 18789 原生双通道直连；
  2. 集成 `tini` 充当 PID 1，实现可靠的信号分发与僵尸进程回收；
  3. 全量数据物理挂载至 `/config/.openclaw/`，保证配置、技能、会话与密钥在容器更新时永久保留；
  4. 支持自建 API 网关与多渠道消息平台（Telegram、Discord 等）。
