# Operation Log

## 2026-04-16

- Continued the new-project reset under the public name `OpenClaw HA Add-on`
- Kept the main page focused on two production entry buttons only:
  - `打开网关`
  - `进入命令行`
- Removed the leftover `/open-shell` helper route so the Shell entry path is now single and direct
- Expanded the Home Assistant config page with additional supported official gateway fields:
  - `gateway_mode`
  - `gateway_remote_url`
  - `gateway_bind_mode`
  - `gateway_auth_mode`
- Added `translations/zh-Hans.yaml` so the add-on config page renders clean localized labels instead of raw field keys
- Rewrote the core document set to align with the new repository identity and current runtime architecture

## Validation

- `cargo test -p haos-ui -p addon-supervisor -p ingressd`
- local `haos-ui` launch with redirect verification:
  - homepage contains only `./open-gateway` and `./shell/`
  - `/open-gateway` returns `307`
  - redirect target resolves to `https://<host>:<gateway_port>/...`
