# OpenClaw HA Add-on

![OpenClaw official logo](https://raw.githubusercontent.com/sunboss/openclaw-ha-addon/main/logo.png)

[![Add repository to Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fsunboss%2Fopenclaw-ha-addon)
[![GitHub last commit](https://img.shields.io/github/last-commit/sunboss/openclaw-ha-addon)](https://github.com/sunboss/openclaw-ha-addon/commits/main)
![Supports aarch64](https://img.shields.io/badge/aarch64-yes-green.svg)
![Supports amd64](https://img.shields.io/badge/amd64-yes-green.svg)
![Home Assistant Add-on](https://img.shields.io/badge/Home%20Assistant-Add--on-18bcf2?logo=homeassistant&logoColor=white)

## English

`OpenClaw HA Add-on` is a thin Home Assistant wrapper for the official OpenClaw runtime.
It keeps the upstream gateway and CLI behavior as intact as possible while giving HAOS users:

- a direct native HTTPS Gateway entry
- a direct maintenance Shell
- a lightweight Home Assistant entry page
- minimal add-on configuration that maps into real runtime behavior

### Quick install

1. Open Home Assistant.
2. Go to `Settings -> Add-ons -> Add-on Store`.
3. Open the top-right menu and choose `Repositories`.
4. Add this repository:

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. Install `OpenClaw HA Add-on`.

### Main entry page

The Home Assistant page stays intentionally small and operational.

- `Open Gateway`
  - Opens the native HTTPS Gateway directly.
- `Open Shell`
  - Opens the maintenance Shell directly.
- `Show Token`
  - Shows the current Gateway token when available.
- `Approve Device`
  - Uses the official `openclaw devices` workflow to list and approve pending browser devices.

### Add-on configuration

The Home Assistant configuration page only exposes fields that are currently wired into the runtime:

- `timezone`
- `disable_bonjour`
- `enable_terminal`
- `terminal_port`
- `gateway_mode`
- `gateway_remote_url`
- `gateway_bind_mode`
- `gateway_port`
- `gateway_public_url`
- `homeassistant_token`
- `http_proxy`
- `gateway_trusted_proxies`
- `gateway_additional_allowed_origins`
- `enable_openai_api`
- `auto_configure_mcp`
- `run_doctor_on_start`
- `skip_acpx_runtime`

## 中文说明

`OpenClaw HA Add-on` 是一个尽量贴近官方 OpenClaw 运行方式的 Home Assistant Add-on。
它不重做上游 Gateway，而是在 HAOS 里提供一层更稳、更薄的适配：

- 原生 HTTPS Gateway 入口
- 直接可用的维护 Shell
- 一个轻量的 Home Assistant 入口页
- 只暴露真正接入运行时的配置项

### 快速安装

1. 打开 Home Assistant。
2. 进入 `设置 -> 加载项 -> 加载项商店`。
3. 打开右上角菜单，选择 `Repositories`。
4. 添加下面这个仓库地址：

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. 安装 `OpenClaw HA Add-on`。

### 主页面

Home Assistant 里的入口页故意保持精简，只保留最关键的操作：

- `打开网关`
  - 直接打开原生 HTTPS Gateway。
- `进入命令行`
  - 直接打开维护 Shell。
- `显示令牌`
  - 在可用时显示当前 Gateway Token。
- `确认授权`
  - 通过官方 `openclaw devices` 流程列出并批准待授权浏览器设备。

### 配置页

Home Assistant 配置页当前只暴露已经接入运行时的字段：

- `timezone`
- `disable_bonjour`
- `enable_terminal`
- `terminal_port`
- `gateway_mode`
- `gateway_remote_url`
- `gateway_bind_mode`
- `gateway_port`
- `gateway_public_url`
- `homeassistant_token`
- `http_proxy`
- `gateway_trusted_proxies`
- `gateway_additional_allowed_origins`
- `enable_openai_api`
- `auto_configure_mcp`
- `run_doctor_on_start`
- `skip_acpx_runtime`

## Documents / 文档

- [Installation Guide / 安装说明](./INSTALL.md)
- [Project Documentation / 项目说明](./DOCS.md)
- [Maintainer Context / 维护说明](./docs/MAINTAINER_CONTEXT.md)
- [Migration Notes / 迁移说明](./MIGRATION.md)

## Official references / 官方参考

- [OpenClaw documentation](https://docs.openclaw.ai/)
- [Control UI](https://docs.openclaw.ai/web/control-ui)
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference)
