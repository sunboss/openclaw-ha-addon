# 🦞 OpenClaw Home Assistant Add-on

本项目为 **OpenClaw** 在 Home Assistant OS 上的官方标准加载项封装工程。

---

## 🌟 架构规范（完全对齐工业级标准）

1. **双通道访问机制**：
   - **Ingress (8099)**：免密直接内嵌于 Home Assistant 侧边栏面板；
   - **局域网直连 (18789)**：通过独立的 Nginx 反向代理段开放原生端口，直接在新标签页秒开，避开 iframe 沙箱限制。
2. **进程管理**：
   - 采用 `tini` 作为 PID 1（`ENTRYPOINT ["/usr/bin/tini", "--", "/run.sh"]`），毫秒级自动收割孤儿进程，绝无僵尸进程残留；
   - 严格进行权限降级，切换为非 root `node` 用户运行。
3. **数据持久化保障**：
   - 挂载点 `addon_config:rw` 映射至容器内部 `/config`；
   - 所有运行时数据、配置、技能与平台密钥全部持久化保存于 `/config/.openclaw/`；
   - 镜像重构/升级绝不丢失任何数据。

---

## 🤖 专职 Agent / Bots 维护说明
- 本项目已完全独立，后续所有 OpenClaw 的开发、补丁、构建由专门的 AI Bots 维护；
- 详见专职维护指南：[`AGENTS.md`](./AGENTS.md)。
