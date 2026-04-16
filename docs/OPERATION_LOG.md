# Operation Log

## 2026-04-16

- Compared the live `openclaw@2026.4.14` dist against the upstream `openclaw/openclaw` source tree and confirmed the remaining `undefined.trim()` crashes came from shared onboarding/setup/auth bundles rather than our Home Assistant auth layer
- Reworked the build-time dist patch to cover every shared onboarding/auth/channel bundle family (`setup-*`, `onboard-*`, `channel-*`, `channels-*`, `oauth*`, `resolve-channels-*`) instead of patching only one `setup-surface-*` file and one `onboard-channels-*` file
- Added local regression verification against the real `openclaw@2026.4.14` npm tarball and confirmed the original unsafe wizard patterns are removed before image build
- Fixed the GHCR build regression in the onboarding patch release by selecting the actual `onboard-channels` bundle that contains the shared `trim()` bug inside the published npm package
- Patched the bundled `openclaw` onboarding dist files at build time so shared QuickStart flows no longer crash on `undefined.trim()` after successful auth or channel setup
- Added a conservative runtime model inference step: if a fresh install already has `openai-codex` auth profiles but no configured primary model yet, the add-on now seeds `agents.defaults.model.primary` with `openai-codex/gpt-5.4`
- Replaced the HA lobster icon assets with a newly cut transparent-background lobster image and removed the stale white-square / black-edge icon variants
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

- `npm pack openclaw@2026.4.14`
- build-time patch dry-run against extracted `openclaw@2026.4.14` dist
- `cargo test -p haos-ui -p addon-supervisor -p ingressd`
- local `haos-ui` redirect verification:
  - homepage contains only `./open-gateway` and `./shell/`
  - `/open-gateway` returns `307`
  - redirect target resolves to `https://<host>:<gateway_port>/#token=...`
