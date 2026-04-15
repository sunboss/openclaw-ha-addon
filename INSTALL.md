# Installation Guide

## Add the repository

1. Open Home Assistant.
2. Go to `Settings -> Add-ons -> Add-on Store`.
3. Open the top-right menu and choose `Repositories`.
4. Add this repository:

```text
https://github.com/sunboss/openclaw-ha-addon
```

5. Refresh the add-on store and install `OpenClaw HA Add-on`.

## First configuration

Before starting the add-on, prepare at least the minimum runtime information you need.

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

## Start and verify

After starting the add-on, verify the following:

1. The Home Assistant add-on page loads correctly.
2. `打开网关` opens the native HTTPS Gateway.
3. `进入命令行` opens the maintenance Shell.
4. The model and status block shows live runtime data instead of placeholders.
5. The token and device approval helpers respond correctly.

## Notes for existing users

If you are moving from an older add-on build:

- the new public name is `OpenClaw HA Add-on`
- the recommended repository URL is:
  - `https://github.com/sunboss/openclaw-ha-addon`
- the add-on slug is:
  - `openclaw_ha_addon`

If Home Assistant still shows the old slug or old paths, remove the old add-on entry and install the new repository/add-on as a fresh project.

## Recommended Web UI path

Use the native HTTPS Gateway path whenever possible:

```text
https://<host>:18789/#token=...
```

This is the most reliable path for official Control UI behavior.
