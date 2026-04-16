# Operation Log

## 2026-04-16

- Forced the HA entry-page lobster icon to bypass browser cache by versioning the asset URL and serving it with `Cache-Control: no-store`
- Fixed the device approval action so the UI now resolves the current pending browser pairing `requestId` before approval, instead of using `openclaw devices approve --latest` and accidentally approving the local CLI device
- Replaced garbled fallback copy in the Gateway jump page, Shell fallback page, and UI fallback page with clean readable recovery text
- Rewrote `README.md`, `DOCS.md`, and `INSTALL.md` into professional bilingual English and Chinese documentation
- Replaced relative logo links with absolute raw GitHub image URLs so the Home Assistant information page can render the full OpenClaw logo reliably
- Restored startup doctor behavior so first boot always runs `openclaw doctor --fix`, while later boots only run it when `run_doctor_on_start` is enabled
- Continued the new-project reset under the public name `OpenClaw HA Add-on`
- Kept the main page focused on two production entry buttons only:
  - `Open Gateway`
  - `Open Shell`
- Removed the leftover `/open-shell` helper route so the Shell entry path is now single and direct
- Expanded the Home Assistant config page with additional supported official gateway fields:
  - `gateway_mode`
  - `gateway_remote_url`
  - `gateway_bind_mode`
  - `gateway_auth_mode`
- Added `translations/zh-Hans.yaml` so the add-on config page renders clean localized labels instead of raw field keys
- Rewrote the core document set to align with the new repository identity and current runtime architecture
- Fixed the Gateway button path under Home Assistant Ingress by forwarding upstream `307` redirects instead of following them inside `ingressd`
- Restricted startup doctor execution to the explicit `run_doctor_on_start` flag, removing the previous one-time automatic doctor run on first boot

## Validation

- `cargo test -p haos-ui -p addon-supervisor -p ingressd`
- local `haos-ui` redirect verification:
  - homepage contains only `./open-gateway` and `./shell/`
  - `/open-gateway` returns `307`
  - redirect target resolves to `https://<host>:<gateway_port>/#token=...`
