# Changelog

## 2026.04.25.1

- Upgrade the vendored upstream OpenClaw source from the official `v2026.4.22` tag to the official `v2026.4.23` tag
- Preinstall the bundled browser plugin runtime dependencies into `dist/extensions/browser/node_modules` during the image build so the Gateway no longer spends its first start repairing that plugin at runtime
- Bake Chromium into the add-on image with the bundled `playwright-core` CLI, aligning the Home Assistant wrapper with the official Docker guidance for browser control and removing the repeated cold-start browser bootstrap path
- Lower the maintenance Shell `ttyd` log level from libwebsockets notice output to warnings/errors only, reducing repeated `rops_handle_POLLIN_netlink: DELADDR` noise in add-on logs

## 2026.04.24.1

- Upgrade the vendored upstream OpenClaw source from the official `v2026.4.21` tag to the official `v2026.4.22` tag
- Keep the Home Assistant wrapper on the source-vendored build path, with no local OpenClaw runtime patches
- Reconfirm the add-on storage mapping against the latest official docs: `/config/.openclaw` remains the HA persistent mirror of upstream `~/.openclaw`, with `/config/.openclaw/workspace` mapped to the official workspace root
- Fix the Docker build-context whitelist so future vendored upstream directory changes do not break GHCR image builds when the OpenClaw version folder name advances
- Force-track the vendored upstream `pnpm-lock.yaml` because upstream `.gitignore` excludes it, but the add-on's source-vendored Docker build still requires that lockfile for reproducible `pnpm install --frozen-lockfile`
- Force-track the vendored upstream `docs/reference/templates/IDENTITY.md` and `USER.md`, which are still required by the final image integrity check even though upstream `.gitignore` ignores them

## 2026.04.18.7

- Add a new `skip_feishu_channel` add-on option that forces `channels.feishu.enabled = false` in the runtime config, letting hosts that no longer use Feishu keep saved credentials while skipping the channel's extra startup work

## 2026.04.18.6

- Add a new `skip_acpx_runtime` add-on option that maps to upstream `OPENCLAW_SKIP_ACPX_RUNTIME=1`, giving low-resource HAOS hosts a supported way to skip the embedded ACPX runtime backend when it is not needed and trim startup CPU and memory spikes

## 2026.04.18.5

- Stop forcing the HA entry-page device approval actions through explicit `--url/--token` gateway flags so the official `openclaw devices list/approve` local loopback fallback can recover from `pairing required` and read the local pairing table as upstream intends
- Give `ingressd` a longer timeout for proxied HA UI requests so slow CLI-backed POST actions like pending-device listing and approval no longer get cut off after 10 seconds and surfaced to the browser as plain-text `502 Bad Gateway`

## 2026.04.18.4

- Reduce GitHub Actions build-cache export scope from `mode=max` to `mode=min` so the `amd64` image job stops spending multiple extra minutes uploading oversized BuildKit cache state after the actual image has already been built and pushed

## 2026.04.18.3

- Keep the build-time Cargo registry and git cache optimization, but stop caching the full Rust `target` directory in Docker BuildKit after the previous attempt filled the GitHub-hosted `amd64` runner disk and broke the image job with `No space left on device`

## 2026.04.18.2

- Fix the new Rust BuildKit cache step so it runs under Docker's default shell correctly on both architectures; the cache-mount optimization stays in place, but the command no longer wraps `cargo build` in an extra shell invocation that broke GHCR builds

## 2026.04.18.1

- Add Docker BuildKit cache mounts for the Rust workspace so repeated image builds can reuse Cargo registry, git, and compiled target artifacts instead of rebuilding the add-on binaries from scratch on every push
- Stop downloading Bun with a retry loop during every upstream image build; the Dockerfile now copies a fixed Bun binary from the official `oven/bun` builder image and keeps `pnpm install` on `--prefer-offline` to reduce repeated network/setup cost

## 2026.04.17.12

- Stop building the upstream QA Lab UI during add-on image builds and stop copying the full upstream `docs/` and `qa/` trees into the final runtime image; the add-on now keeps only the official packaged `docs/reference/templates` set that OpenClaw runtime bootstrapping actually requires
- Tighten `.dockerignore` so the Docker build context only ships the Rust workspace, add-on config, Dockerfile, and vendored upstream source instead of the whole repository checkout

## 2026.04.17.11

- Add GitHub Actions buildx GHA cache scopes for both `amd64` and `arm64` image jobs so follow-up builds can reuse prior Docker layers instead of rebuilding the full vendored upstream workspace from scratch every push
- Add a no-refresh status sync path on the Home Assistant entry page so the browser polls `status.json` every 15 seconds and updates the key runtime fields in place instead of reloading the whole page

## 2026.04.17.10

- Force the HA add-on device approval actions to call `openclaw devices` against the internal loopback gateway (`ws://127.0.0.1:18790`) with the active runtime token instead of inheriting whatever external/public gateway port the current config file happens to contain
- Reconcile runtime config drift while the add-on is running so wizard-written changes cannot leave `gateway.port` on the public wrapper port or strip loopback `gateway.trustedProxies`, which was breaking local-client detection behind the add-on proxy until the next restart
- Harden gateway token file refresh so reconciling runtime config can safely recreate the token export directory before writing `gateway.token`

## 2026.04.17.9

- Add workspace-template integrity checks in both the add-on supervisor and the final image build so packaging mistakes fail fast instead of surfacing later during `openclaw onboard`
- Force-track the vendored upstream `docs/reference/templates/IDENTITY.md` and `USER.md` files even though upstream `.gitignore` ignores them, because the official packaged runtime and workspace bootstrap both require those templates at runtime

## 2026.04.17.8

- Stop auto-running `openclaw doctor --fix` on first boot when `run_doctor_on_start` is left at its default `false`, so low-memory HAOS hosts do not trigger a startup doctor OOM loop while onboarding

## 2026.04.17.7

- Add a low-memory HAOS runtime guard by exporting `NODE_OPTIONS=--max-old-space-size=512` from the add-on supervisor unless the environment already sets a heap cap, so `openclaw onboard`, startup doctor, and other CLI flows stop getting OOM-killed on 2 GB Home Assistant hosts

## 2026.04.17.6

- Align the add-on configuration surface with the official token-based Gateway path by removing the exposed `gateway_auth_mode` option and always writing `gateway.auth.mode = "token"`
- Change `enable_openai_api` to default to `false`, matching upstream `gateway.http.endpoints.chatCompletions.enabled`
- Harden the upstream source Docker copy step by explicitly copying the root `package.json`, `pnpm-lock.yaml`, and `openclaw.mjs` files after the vendored source tree copy so GHCR buildx sees the official CLI entry files reliably on both architectures

## 2026.04.17.5

- Vendor the exact official `openclaw/openclaw` `v2026.4.15` source tree under `upstream/openclaw-v2026.4.15` and switch the add-on image to build the upstream runtime from source instead of installing the published npm tarball

## 2026.04.17.4

- Upgrade the bundled upstream runtime from the official published `openclaw@2026.4.14` package to `openclaw@2026.4.15` while keeping the Home Assistant wrapper behavior unchanged
## 2026.04.17.3

- Replace the failing in-image upstream source build with the official published `openclaw@2026.4.14` npm tarball path, so GHCR builds no longer depend on compiling the full upstream workspace and its optional native development dependencies

## 2026.04.17.2

- Stop mutating the installed `openclaw` package after build by removing the extra `npm install --no-save --ignore-scripts ...` dependency injection step, leaving the runtime as an official upstream build plus the Home Assistant wrapper only

## 2026.04.17.1

- Stop patching the official OpenClaw setup/onboarding source during image build and return to an unmodified upstream `openclaw/openclaw` `v2026.4.14` source build while keeping the Home Assistant wrapper UI and services intact

## 2026.04.16.14

- Rebuild the bundled OpenClaw runtime from the official `openclaw/openclaw` `v2026.4.14` source tag during image build instead of installing the published npm dist and patching hashed bundles afterward
- Patch the shared onboarding/setup source files before build so auth setup, channel setup, remote gateway auth, and wizard text inputs no longer crash on `TypeError: Cannot read properties of undefined (reading 'trim')`

## 2026.04.16.13

- Narrow the onboarding/channel dist patch to the real shared wizard crash shapes that still existed in the published `openclaw@2026.4.14` package, including the common `await prompter.text(...).trim()` helpers used by Feishu/Lark, Zalo, remote auth, and other setup flows

## 2026.04.16.12

- Expand the onboarding/auth/channel dist patch so it rewrites the shared `setup-*`, `onboard-*`, `channel-*`, `channels-*`, `oauth*`, and `resolve-channels-*` bundles in `openclaw@2026.4.14`, eliminating the remaining `TypeError: Cannot read properties of undefined (reading 'trim')` crashes after successful auth or channel setup

## 2026.04.16.11

- Fix the GHCR build for the onboarding patch release by patching the correct `onboard-channels-*.js` bundle inside the published `openclaw@2026.4.14` package

## 2026.04.16.10

- Patch the bundled `openclaw@2026.4.14` onboarding dist files during image build so shared QuickStart flows no longer crash on `TypeError: Cannot read properties of undefined (reading 'trim')` after successful auth / channel setup
- Infer `agents.defaults.model.primary = openai-codex/gpt-5.4` when a fresh install already has `openai-codex` auth profiles but no saved model yet, preventing the runtime from incorrectly falling back to `openai/gpt-5.4`

## 2026.04.16.9

- Replace the HA entry-page lobster icon assets with a freshly cut transparent-background lobster image and remove the stale white-square / black-edge variants

## 2026.04.16.8

- Force-refresh the add-on header lobster icon by adding cache-busting to the UI asset URL and serving the icon with `Cache-Control: no-store`, so Home Assistant no longer shows the stale cropped image

## 2026.04.16.7

- Fix device approval so the UI no longer runs `openclaw devices approve --latest`; it now reads the current pending list first and approves the explicit browser `requestId`, avoiding accidental approval of the local CLI device

## 2026.04.16.6

- Replace garbled fallback text in the Gateway, Shell, and UI recovery pages with clean readable copy so the jump page no longer shows mojibake

## 2026.04.16.5

- Rewrite `README`, `DOCS`, and `INSTALL` into clean bilingual English and Chinese documentation
- Replace relative logo references with stable absolute raw GitHub image URLs so the Home Assistant information page can render the full OpenClaw logo reliably

## 2026.04.16.4

- Restore startup doctor behavior to run on first boot automatically, then defer to the `run_doctor_on_start` switch on later boots

## 2026.04.16.3

- Fix the Gateway button redirect when opened through Home Assistant Ingress by preserving upstream `307` redirects instead of following them inside `ingressd`
- Stop running `openclaw doctor --fix` automatically on first boot unless `run_doctor_on_start` is explicitly enabled, reducing startup delay

## 2026.04.16.2

- Keep the main page on only two formal entry buttons:
  - native HTTPS Gateway
  - maintenance Shell
- Remove the leftover `/open-shell` helper route from the UI service
- Expand the add-on configuration page with the supported official gateway fields:
  - `gateway_mode`
  - `gateway_remote_url`
  - `gateway_bind_mode`
  - `gateway_auth_mode`
- Add Chinese configuration translations so the Home Assistant config page no longer falls back to raw keys
- Rewrite README, DOCS, INSTALL, and maintainer notes into clean project documentation aligned with the new public name
