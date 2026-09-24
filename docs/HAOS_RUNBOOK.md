# OpenClaw Home Assistant OS 运维运行手册 (HAOS_RUNBOOK.md)

---

## 一、加载项生命周期与更新流

1. **添加软件源**：
   - 打开 Home Assistant -> **设置** -> **加载项** -> **加载项商店**；
   - 点击右上角菜单 -> **存储库** -> 添加仓库地址：`https://github.com/sunboss/openclaw-ha-addon`。
2. **安装与初始化**：
   - 在加载项商店中搜索 `OpenClaw`，点击安装；
   - 在“配置”页填入您的 `openai_api_key`（或留空使用第三方渠道）；
   - 点击“启动”并勾选“在侧边栏中显示”。
3. **数据安全承诺**：
   - 容器内所有数据均落盘于宿主机物理路径：`/mnt/data/supervisor/app_configs/<slug>_openclaw/`；
   - 包含：`workspace/`、`skills/`、`sessions/`、`openclaw.json`、`.env`；
   - 无论升级多少次镜像，宿主机物理数据永不丢失。

---

## 二、双通道访问规范

| 访问通道 | 端口/路径 | 特性 | 推荐场景 |
| :--- | :--- | :--- | :--- |
| **HA 侧边栏 Ingress** | `/app/<slug>_openclaw` (8099) | 免密码登录、内嵌面板 | 日常轻量查询、手机 HA App 内使用 |
| **局域网原生直连** | `http://<ha-ip>:18789` | 原生全屏、独立 WebSocket、秒级响应 | 长文本编写、多任务深度调试 |
