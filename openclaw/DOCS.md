# OpenClaw Home Assistant Add-on

🦞 **OpenClaw** 是运行在您自己设备上的个人 AI 助手，具备全渠道连接（Telegram、Discord、Slack、WeChat、WebChat）、自定义技能扩展以及实时 Control UI 控制台。

---

## 🌟 核心特性

- **双重访问通道**：
  - **HA 侧边栏 Ingress**：免密码直通，直接内嵌在 Home Assistant 页面中。
  - **局域网原生直连**：开放 `18789` 端口，独立标签页秒开，不受 iframe 限制。
- **全量数据持久化**：
  - 所有技能、记忆、聊天记录与平台密钥全部持久化保存于 `/config/.openclaw/`。
  - 升级加载项镜像**绝对不丢失任何数据**。
- **工业级进程治理**：
  - 由 `tini` 作为 PID 1 接管子进程，毫秒级自动收割孤儿进程，绝无僵尸进程残留。
  - 权限自动降级至非 root `node` 用户运行，安全合规。

---

## ⚙️ 配置说明

在加载项的“配置”页面中，您可以设置：
- `llm_model`: 默认模型名称（如 `claude-3-7-sonnet`、`gemini-3.8-flash-high`）。
- `openai_base_url`: 模型 API 地址（默认使用您自建的网关 `https://api.1234r.com/v1`）。
- `openai_api_key`: 模型 API Key。
- `gateway_token`: 网关鉴权令牌（已默认自动生成持久化 Token）。
- `telegram_bot_token`: Telegram Bot Token（可选）。
- `discord_bot_token`: Discord Bot Token（可选）。
