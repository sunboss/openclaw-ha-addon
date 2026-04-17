# Changelog

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
