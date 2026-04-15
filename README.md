# OpenClaw HA Add-on

![OpenClaw official logo](./logo.png)

[![Add repository to Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fsunboss%2Fopenclaw-ha-addon)
[![GitHub last commit](https://img.shields.io/github/last-commit/sunboss/openclaw-ha-addon)](https://github.com/sunboss/openclaw-ha-addon/commits/main)
![Supports aarch64](https://img.shields.io/badge/aarch64-yes-green.svg)
![Supports amd64](https://img.shields.io/badge/amd64-yes-green.svg)
![Home Assistant Add-on](https://img.shields.io/badge/Home%20Assistant-Add--on-18bcf2?logo=homeassistant&logoColor=white)

`OpenClaw HA Add-on` is a thin Home Assistant wrapper around the official OpenClaw runtime.
It keeps the upstream Gateway and CLI behavior intact, while giving HAOS users a reliable HTTPS launch path and a direct maintenance Shell entry.

`OpenClaw HA Add-on` 是一个尽量贴近官方 OpenClaw 运行方式的 Home Assistant Add-on。
它不重做上游控制台，而是提供一层更薄、更稳定的 HAOS 适配：启动、Ingress、HTTPS 入口、维护 Shell，以及少量必要的状态与授权辅助。

## What this project includes

- Official OpenClaw runtime started through a Rust supervisor
- Native HTTPS Gateway launch path
- Direct maintenance Shell based on `ttyd`
- Thin Home Assistant entry page
- Token display and device approval helpers
- Add-on config fields that are actually wired into runtime behavior

## Quick install

1. Open Home Assistant.
2. Go to `Settings -> Add-ons -> Add-on Store`.
3. Open the top-right menu and choose `Repositories`.
4. Add this repository:

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. Install `OpenClaw HA Add-on`.

## Main entry page

The main page intentionally stays thin and operational.

- `打开网关`
  - Opens the native HTTPS Gateway directly
- `进入命令行`
  - Opens the maintenance Shell directly
- `显示令牌`
  - Shows and copies the active Gateway token
- `授权提醒与确认`
  - Lists devices and approves the latest request through official `openclaw devices` commands

The old HAOS HTTP test entry is no longer exposed on the main page.

## Add-on configuration

The Home Assistant configuration page is generated from [`config.yaml`](./config.yaml).
This project exposes only fields that are actually consumed end-to-end:

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

## Documents

- [Installation guide](./INSTALL.md)
- [Project documentation](./DOCS.md)
- [Maintainer context](./docs/MAINTAINER_CONTEXT.md)
- [Migration notes](./MIGRATION.md)

## Official references

- [OpenClaw documentation](https://docs.openclaw.ai/)
- [Control UI](https://docs.openclaw.ai/web/control-ui)
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference)
