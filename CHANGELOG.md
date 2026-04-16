# Changelog

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
