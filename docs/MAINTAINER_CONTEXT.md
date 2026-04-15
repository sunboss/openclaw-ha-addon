# Maintainer Context

This file is the durable handoff memory for `OpenClaw HA Add-on`.

## Project goal

The project is a Home Assistant add-on wrapper around the official OpenClaw runtime.
It should stay thin, predictable, and easy to maintain.

Do not turn the add-on page into a second full control panel.

## Current runtime layout

- `crates/addon-supervisor`
  - bootstraps config
  - prepares environment
  - starts and supervises local services
- `crates/ingressd`
  - serves Home Assistant ingress
  - proxies the native HTTPS Gateway
  - proxies the maintenance Shell
- `crates/haos-ui`
  - serves the thin main page
- `crates/oc-config`
  - helpers for editing official `openclaw.json`

## Supported page surface

The main page should stay small and practical.

- `打开网关`
- `进入命令行`
- current model and lightweight status
- Gateway token show/copy
- device list and approve-latest helpers

Removed surfaces should not quietly come back.

## Supported add-on options

Only expose configuration fields that are understandable and actually wired into runtime behavior:

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

Do not re-add dangerous debug toggles as a normal supported surface.

## Runtime boundaries

- Primary Web UI path:
  - `https://<host>:18789/#token=...`
- Internal Gateway:
  - `127.0.0.1:18790`
- Maintenance Shell:
  - `ttyd`
- Main page:
  - thin helper shell only

## Testing expectations

Do not guess about click behavior.

When page actions are changed:

1. run unit tests
2. build the affected binary
3. start the local service when possible
4. inspect the rendered HTML, redirect headers, or live browser hit targets

For the two main entry buttons, verify at least:

- the homepage contains the expected `href`
- `/open-gateway` returns the expected redirect location
- the rendered button center is not covered by a decorative layer

## Versioning

- Add-on version format:
  - `YYYY.MM.DD.N`
- Every push increments the version.

## Release metadata that must stay aligned

- `config.yaml`
- `repository.yaml`
- `README.md`
- `INSTALL.md`
- `DOCS.md`
- `.github/workflows/build-ghcr.yml`
- `Dockerfile`

## New public project identity

- Name:
  - `OpenClaw HA Add-on`
- Repository:
  - `sunboss/openclaw-ha-addon`
- Image:
  - `ghcr.io/sunboss/openclaw-ha-addon`
- Slug:
  - `openclaw_ha_addon`
