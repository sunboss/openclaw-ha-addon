# OpenClaw HA Add-on

![OpenClaw official logo](https://raw.githubusercontent.com/sunboss/openclaw-ha-addon/main/logo.png)

[![Add repository to Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fsunboss%2Fopenclaw-ha-addon)
[![GitHub last commit](https://img.shields.io/github/last-commit/sunboss/openclaw-ha-addon)](https://github.com/sunboss/openclaw-ha-addon/commits/main)
![Supports aarch64](https://img.shields.io/badge/aarch64-yes-green.svg)
![Supports amd64](https://img.shields.io/badge/amd64-yes-green.svg)
![Home Assistant Add-on](https://img.shields.io/badge/Home%20Assistant-Add--on-18bcf2?logo=homeassistant&logoColor=white)

## English

`OpenClaw HA Add-on` is a thin Home Assistant wrapper around the official OpenClaw runtime.
It keeps the upstream Gateway and CLI behavior intact while giving HAOS users a reliable HTTPS launch path and a direct maintenance Shell entry.

### What this project includes

- Official OpenClaw runtime managed by a Rust supervisor
- Native HTTPS Gateway launch path
- Direct maintenance Shell based on `ttyd`
- Thin Home Assistant entry page with only the core operational actions
- Token display and device approval helpers
- Add-on configuration fields that are actually wired into runtime behavior

### Quick install

1. Open Home Assistant.
2. Go to `Settings -> Add-ons -> Add-on Store`.
3. Open the top-right menu and choose `Repositories`.
4. Add this repository:

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. Install `OpenClaw HA Add-on`.

### Main page

The main page intentionally stays operational and minimal.

- `Open Gateway`
  - Opens the native HTTPS Gateway directly
- `Open Shell`
  - Opens the maintenance Shell directly
- `Show Token`
  - Displays the current Gateway token when available
- `Approve Device`
  - Lists devices and approves the latest request through official `openclaw devices` commands

### Add-on configuration

The Home Assistant configuration page is generated from [`config.yaml`](./config.yaml).
This project only exposes fields that are currently wired end-to-end:

- `timezone`
- `disable_bonjour`
- `enable_terminal`
- `terminal_port`
- `gateway_mode`
- `gateway_remote_url`
- `gateway_bind_mode`
- `gateway_port`
- `gateway_public_url`
- `gateway_auth_mode`
- `homeassistant_token`
- `http_proxy`
- `gateway_trusted_proxies`
- `gateway_additional_allowed_origins`
- `enable_openai_api`
- `auto_configure_mcp`
- `run_doctor_on_start`

## 中文说明

`OpenClaw HA Add-on` 是一个尽量保持官方 OpenClaw 运行方式不变的 Home Assistant Add-on。
它不重做上游 Gateway，而是提供一层更稳、更薄的 HAOS 适配：启动、Ingress、HTTPS 打开路径，以及直接可用的维护 Shell。

### 这个项目包含什么

- 由 Rust supervisor 管理的官方 OpenClaw runtime
- 原生 HTTPS Gateway 打开路径
- 基于 `ttyd` 的维护 Shell
- 只保留核心操作的 Home Assistant 入口页
- 令牌显示与设备授权辅助
- 真正接入运行时的 add-on 配置项

### 快速安装

1. 打开 Home Assistant。
2. 进入 `设置 -> 加载项 -> 加载项商店`。
3. 打开右上角菜单，选择 `Repositories`。
4. 添加下面这个仓库地址：

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. 安装 `OpenClaw HA Add-on`。

### 主页面说明

主页面刻意保持精简，只保留最重要的操作入口。

- `打开网关`
  - 直接打开原生 HTTPS Gateway
- `进入命令行`
  - 直接打开维护 Shell
- `显示令牌`
  - 显示当前 Gateway Token
- `授权提醒 / 确认授权`
  - 通过官方 `openclaw devices` 命令列出设备并确认最新请求

### Add-on 配置页

Home Assistant 配置页由 [`config.yaml`](./config.yaml) 自动生成。
当前只暴露已经真正接入运行时的配置项：

- `timezone`
- `disable_bonjour`
- `enable_terminal`
- `terminal_port`
- `gateway_mode`
- `gateway_remote_url`
- `gateway_bind_mode`
- `gateway_port`
- `gateway_public_url`
- `gateway_auth_mode`
- `homeassistant_token`
- `http_proxy`
- `gateway_trusted_proxies`
- `gateway_additional_allowed_origins`
- `enable_openai_api`
- `auto_configure_mcp`
- `run_doctor_on_start`

## Documents / 文档

- [Installation Guide / 安装说明](./INSTALL.md)
- [Project Documentation / 项目说明](./DOCS.md)
- [Maintainer Context / 维护说明](./docs/MAINTAINER_CONTEXT.md)
- [Migration Notes / 迁移说明](./MIGRATION.md)

## Official references / 官方参考

- [OpenClaw documentation](https://docs.openclaw.ai/)
- [Control UI](https://docs.openclaw.ai/web/control-ui)
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference)
