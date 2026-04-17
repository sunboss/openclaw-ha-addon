# Operation Log

## 2026-04-18

- Vendored the exact upstream `openclaw/openclaw` `v2026.4.15` source tree into `upstream/openclaw-v2026.4.15` and removed the temporary exploratory clone so the add-on repository now carries the full upstream source needed for reviewable builds
- Switched the add-on image build back from `npm pack openclaw@...` to building the bundled upstream source directly with the upstream `pnpm` workspace flow before assembling the Home Assistant wrapper image
- Removed the exposed `gateway_auth_mode` add-on option and aligned the wrapper to the supported Home Assistant deployment stance here: token-based gateway auth only
- Changed the add-on `enable_openai_api` default back to `false` so the generated `gateway.http.endpoints.chatCompletions.enabled` setting matches the current upstream default instead of enabling the endpoint by default
- Updated repository docs, translations, ignore rules, and maintainer notes so the supported configuration surface and build story match the new upstream-vendored token-only baseline

## 2026-04-17

- Replaced the failing in-image upstream source build with a direct install path from the official published `openclaw@2026.4.14` npm tarball after confirming that the tarball itself installs successfully in a clean local npm prefix
- Removed the `git clone` + `pnpm install` + `pnpm build:docker` + `npm pack` Docker path that was pulling optional native build dependencies such as `@discordjs/opus` into the GHCR workflow and blocking image publication
- Removed the post-install `npm install --no-save --ignore-scripts ...` step that injected bundled plugin dependencies directly into `/usr/local/lib/node_modules/openclaw`, so the shipped runtime is now the upstream `openclaw` build as-is rather than an add-on-mutated dependency tree
- Removed the custom `patch-openclaw-source.mjs` step from the image build and returned the runtime build to the official `openclaw/openclaw` `v2026.4.14` source tree without local onboarding/setup source mutations
- Kept the Home Assistant add-on wrapper, ingress layer, HTTPS gateway entry, maintenance shell entry, and branding assets unchanged while resetting only the embedded OpenClaw runtime build path

## 2026-04-16

- Switched the runtime build away from `npm install openclaw@2026.4.14` and onto the official `openclaw/openclaw` `v2026.4.14` source tag so the add-on no longer depends on post-install mutation of hashed dist bundles
- Added a source-level patch step for the shared wizard/setup files that still called `.trim()` on possibly undefined prompt results in auth setup, channel setup, remote gateway auth, and plugin config flows
- Verified from the official source tag that `src/channels/plugins/setup-wizard-helpers.ts`, `src/channels/plugins/setup-wizard.ts`, `src/commands/onboard-custom.ts`, `src/commands/onboard-remote.ts`, `src/wizard/setup.ts`, and `src/wizard/setup.plugin-config.ts` still contained shared unsafe prompt-result trims
- Validated the new source build chain locally against the official `v2026.4.14` source tag:
  - `pnpm install --frozen-lockfile`
  - `pnpm build:docker`
  - `node scripts/ui.js build`
  - `OPENCLAW_PREPACK_PREPARED=1 npm pack`
- Confirmed the source build now produces a fresh `openclaw-2026.4.14.tgz` tarball after rebuilding runtime `dist/` and `dist/control-ui/`, rather than reusing stale prepublished bundle output
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

- local official source-tag validation:
  - `npm.cmd pack openclaw@2026.4.14 --pack-destination C:\Users\SunBoss\Desktop\555\.tmp-openclaw-npm`
  - `npm.cmd install --prefix C:\Users\SunBoss\Desktop\555\.tmp-openclaw-install --omit=dev C:\Users\SunBoss\Desktop\555\.tmp-openclaw-npm\openclaw-2026.4.14.tgz`
- `cargo test -p haos-ui -p addon-supervisor -p ingressd`
- local `haos-ui` redirect verification:
  - homepage contains only `./open-gateway` and `./shell/`
  - `/open-gateway` returns `307`
  - redirect target resolves to `https://<host>:<gateway_port>/#token=...`
