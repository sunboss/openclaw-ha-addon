# Installation Guide / 安装说明

![OpenClaw official logo](https://raw.githubusercontent.com/sunboss/openclaw-ha-addon/main/logo.png)

## English

### Add the repository

1. Open Home Assistant.
2. Go to `Settings -> Add-ons -> Add-on Store`.
3. Open the top-right menu and choose `Repositories`.
4. Add this repository:

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. Refresh the add-on store and install `OpenClaw HA Add-on`.

### First configuration

Before starting the add-on, prepare the minimum runtime information you need.

Recommended minimum:

- a working model configuration
- the corresponding provider URL or API key
- whether you want Home Assistant MCP auto-configuration

Useful add-on options in the Home Assistant config page:

- `timezone`
- `enable_terminal`
- `terminal_port`
- `gateway_port`
- `gateway_public_url`
- `homeassistant_token`
- `http_proxy`
- `enable_openai_api`
- `auto_configure_mcp`
- `run_doctor_on_start`

### Start and verify

After starting the add-on, verify the following:

1. The Home Assistant add-on page loads correctly.
2. `Open Gateway` opens the native HTTPS Gateway.
3. `Open Shell` opens the maintenance Shell.
4. The model and status block shows live runtime data instead of placeholders.
5. The token and device approval helpers respond correctly.

## 中文说明

### 添加仓库

1. 打开 Home Assistant。
2. 进入 `设置 -> 加载项 -> 加载项商店`。
3. 打开右上角菜单，选择 `Repositories`。
4. 添加下面这个仓库地址：

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. 刷新加载项商店，然后安装 `OpenClaw HA Add-on`。

### 首次配置

在启动 add-on 之前，建议先准备好最基本的运行信息。

最少建议包括：

- 一套可用的模型配置
- 对应 provider 的 URL 或 API Key
- 是否需要自动配置 Home Assistant MCP

配置页里比较常用的字段有：

- `timezone`
- `enable_terminal`
- `terminal_port`
- `gateway_port`
- `gateway_public_url`
- `homeassistant_token`
- `http_proxy`
- `enable_openai_api`
- `auto_configure_mcp`
- `run_doctor_on_start`

### 启动与验证

启动后建议确认以下几项：

1. Home Assistant 里的 add-on 页面可以正常打开。
2. `打开网关` 能正常打开原生 HTTPS Gateway。
3. `进入命令行` 能正常打开维护 Shell。
4. 模型和状态区域显示的是实时运行数据，而不是占位值。
5. Token 和设备授权辅助动作都能正常响应。

### 从旧项目迁移

如果你是从旧 add-on 迁移过来：

- 新公开名称是 `OpenClaw HA Add-on`
- 推荐仓库地址是：
  - `https://github.com/sunboss/openclaw-ha-addon`
- 新 add-on slug 是：
  - `openclaw_ha_addon`

如果 Home Assistant 里仍然显示旧 slug 或旧路径，建议移除旧 add-on，再按新仓库重新安装。

## Recommended Web UI path / 推荐 WebUI 打开方式

Whenever possible, use the native HTTPS Gateway path:

```text
https://<host>:18789/#token=...
```

尽量优先使用原生 HTTPS Gateway 路径：

```text
https://<主机>:18789/#token=...
```
