# Operation Log

## 2026-04-24

- Upgraded the vendored upstream runtime again, this time from official `v2026.4.21` to official `v2026.4.22`, and aligned the add-on release number to `2026.04.24.1`.
- Rechecked the latest official storage-layout docs before the upgrade and confirmed that upstream still treats `~/.openclaw` as the state/config root and `~/.openclaw/workspace` as the default workspace.
- Kept the HA add-on mapping on `/config/.openclaw` and `/config/.openclaw/workspace`, which is the intended persistent Home Assistant mirror of the upstream defaults, with `/root/.openclaw` preserved only as a compatibility symlink.

## 2026-04-23

- Pushed rollback tag `v2026.04.17.3` before the runtime upgrade, preserving the last stable add-on state for rollback.
- Rebased the OpenClaw runtime upgrade onto current `origin/main` so the existing source-vendored build and HAOS startup optimizations stay intact.
- Replaced the vendored upstream source target from `upstream/openclaw-v2026.4.15` to the official `upstream/openclaw-v2026.4.21` source snapshot and updated Docker build args to `OPENCLAW_VERSION=2026.4.21`.
- Updated the add-on version to `2026.04.23.1`; no local OpenClaw runtime source patches were added.

## 2026-04-18

- Confirmed from HAOS startup timing that `OPENCLAW_SKIP_ACPX_RUNTIME=1` works but only trims a small part of the cold-start spike; the more meaningful remaining startup cost is the Feishu channel path, which still begins initializing roughly `28-31 s` after gateway boot starts
- Added a final add-on option `skip_feishu_channel` that forces `channels.feishu.enabled = false` in the reconciled runtime config, so operators who no longer use Feishu can keep their saved channel credentials but stop paying its startup CPU and memory cost on every restart
- Added a new add-on option `skip_acpx_runtime` that maps directly to upstream `OPENCLAW_SKIP_ACPX_RUNTIME=1`, so low-resource HAOS hosts can skip the embedded ACPX runtime backend without patching upstream source and we can measure the startup CPU/memory trade-off explicitly
- After the Home Assistant store metadata finally refreshed, the HAOS test host `192.168.1.115` successfully upgraded the add-on from `2026.04.18.4` to `2026.04.18.5`; the `ha apps update` call ran for about `112 s`, Supervisor pulled `ghcr.io/sunboss/openclaw-ha-addon:2026.04.18.5`, removed the old `.18.4` image, and then started the new `.18.5` container successfully
- Post-upgrade metadata on the same host now reports `version=2026.04.18.5`, `version_latest=2026.04.18.5`, `state=started`, and `update_available=false`
- The host-level Docker image size remained flat after the upgrade: `ghcr.io/sunboss/openclaw-ha-addon:2026.04.18.5` is reported as `2.43 GB` unpacked on the HAOS host, matching the prior `.18.4` image footprint
- A settled `.18.5` runtime on the HAOS host now sits around `483.8 MB` RSS (`23.39%` of the 2 GB limit) with near-idle CPU around `0.09%`; during the immediate post-upgrade startup window, transient usage was still about `565.9 MB` and `71.31%` CPU before falling back to steady state
- Version `2026.04.18.5` kept essentially the same startup profile as `.18.4`: the gateway moved from `loading configuration…` at `09:14:08` to `ready` at `09:14:26`, for an observed `17.6 s` gateway boot, while Feishu plus embedded ACPX sidecars finished coming up around `28-31 s` later in that same restart window
- Post-upgrade response probes on the HAOS host returned `200` from the native gateway in about `123 ms` and `200` from the ingress entry in about `3.8 ms`
- On the HAOS test host `192.168.1.115`, the installed add-on is still `2026.04.18.4` and Supervisor metadata still reports `version_latest=2026.04.18.4`, so the published `2026.04.18.5` image is available in GHCR but is not yet being offered to this host through the Home Assistant add-on store
- The published `2026.04.18.5` GHCR image size remains effectively flat relative to the prior release: the registry manifests resolve to about `430.33 MB` for `amd64` and about `426.83 MB` for `arm64`; on the HAOS test host, Docker currently reports the installed `ghcr.io/sunboss/openclaw-ha-addon:2026.04.18.4` image at `2.43 GB` unpacked
- Current steady-state runtime on the HAOS host after the latest restart test is about `462.6 MB` RSS (`22.36%` of the 2 GB memory limit) with near-idle CPU around `0.13%`
- A fresh `.18.4` restart on the same host still shows a high but bounded cold-start resource spike: sampled CPU peaked at about `78.35%` and sampled memory peaked at about `602.1 MB` before settling back under `463 MB`
- The most reliable startup timing remains the upstream gateway logs rather than wrapper HTTP probes, because the proxy can continue returning `200` during in-process restarts; the latest measured restart reached `gateway ready` in about `17.7 s` (`09:01:52` loading configuration to `09:02:10` ready), while the previous measured restart reached `gateway ready` in about `16.5 s`, and Feishu plus embedded ACPX sidecars did not fully come up until roughly `30-38 s` after the gateway restart began

- Reproduced the HA entry-page "待批准设备 / 返回格式无效" bug on the test host and split it into two separate faults: the direct UI endpoint on `127.0.0.1:48101` was already returning valid JSON, but the ingress entrypoint on `127.0.0.1:48099` was cutting off CLI-backed `POST /action/devices-list` requests after the proxy client's `10 s` timeout and returning plain-text `502 Bad Gateway`, which the browser then surfaced as "返回格式无效"
- Traced the remaining device-approval failure behind that proxy error to our own add-on wrapper: the HA UI had been forcing `openclaw devices list/approve` through explicit internal `--url ws://127.0.0.1:18790 --token ...` flags, which disables the upstream CLI's built-in local loopback pairing fallback; the follow-up fix removes those explicit flags for device actions and lets the official local fallback read/approve pending pairing state as upstream intended
- Profiled a cold restart on the HAOS test host after upgrading to `2026.04.18.4`: CPU stayed roughly between `64%` and `73%` for the first `32 s`, while memory climbed from about `71 MB` at restart to about `567 MB` by `40 s`; the wrapped gateway reported `ready` after about `17.6 s`, but channel and sidecar startup continued afterward, with the Feishu websocket path and embedded ACPX runtime still initializing around the `20-30 s` mark
- On the HAOS test host `192.168.1.115`, refreshed Supervisor store metadata until `version_latest` exposed `2026.04.18.4`, then upgraded the installed add-on from `2026.04.17.12` to `2026.04.18.4` successfully; post-upgrade `ha apps info` reported `version=2026.04.18.4`, `version_latest=2026.04.18.4`, `state=started`, and `update_available=false`
- Verified post-upgrade runtime behavior on the same HAOS host: supervisor logs showed the wrapped gateway reaching `ready` in about `16.5 s`, a follow-up probe returned `200` from the native gateway in about `125 ms` and `200` from the ingress endpoint in about `5 ms`, and steady-state resource usage remained around `438 MB` RAM with negligible idle CPU
- Compared the old sub-10-minute image run against the current full-source build and confirmed the biggest remaining `amd64` regression is not Rust or pnpm itself but BuildKit cache export: the latest successful run spent about `472 s` exporting GHA cache, including about `153 s` preparing cache state and about `319 s` sending it, so the next optimization pass reduces `cache-to` from `mode=max` to `mode=min`
- After the first cache-mount release reached GitHub Actions, the `amd64` runner failed with `No space left on device` while `arm64` succeeded; the likely trigger was persisting the full Rust `target` cache on top of the already-heavy upstream Node build, so the follow-up release keeps only lightweight Cargo registry/git caches and drops the `target` cache mount
- Corrected the first Rust cache-mount Dockerfile attempt after GHCR showed both architectures failing immediately on the extra shell wrapper; the cache optimization now keeps the same Cargo target copy-back behavior but uses Docker's native command chaining so BuildKit can execute it portably
- Measured the current HAOS runtime after the `2026.04.17.12` fixes: the add-on now returns `200` on the native gateway in about `123 ms`, returns `200` on the ingress endpoint in about `3 ms`, reaches first successful HTTP responses roughly `13 s` after a restart, and reports gateway `ready` in upstream logs after about `17.6 s`; steady-state memory on the test host is now about `503 MB` instead of the earlier crash-loop state above `700 MB`
- Queried GHCR manifests directly to quantify image size without host Docker access: `2026.04.17.12-amd64` is about `430.33 MB` and `2026.04.17.12-arm64` is about `426.80 MB`, down from `438.29 MB` and `434.77 MB` on `2026.04.17.11`
- Added Docker BuildKit cache mounts for Cargo registry, git, and compiled targets so repeated add-on image builds can reuse Rust dependencies and release artifacts instead of rebuilding the entire Rust workspace from zero every GitHub Actions run
- Replaced the Dockerfile's per-build Bun download loop with a fixed copy from the official `oven/bun` image and switched the upstream `pnpm install` step to `--prefer-offline`, reducing one more repeated network/bootstrap cost in the heavy upstream builder stage
- Reduced the add-on build/runtime payload further by removing `pnpm qa:lab:build` from the image build, dropping the full upstream `docs/` and `qa/` trees from the final runtime image, and keeping only `docs/reference/templates`, which matches the official packaged runtime surface that workspace bootstrapping actually needs
- Tightened `.dockerignore` to send only the Rust workspace, add-on config files, Dockerfile, and vendored upstream source into the Docker build context; this trims unnecessary context upload overhead before BuildKit even starts the expensive upstream Node build
- Verified from HAOS logs that the current "startup slow" symptom was not a general container boot problem but an old-version gateway crash loop: the runtime kept trying to bind `127.0.0.1:18789`, colliding with `ingressd`, and then respawning roughly every 30 seconds; the add-on-side config reconciliation added in `2026.04.17.10` is the fix for that drifted internal-port state
- Added GitHub Actions buildx GHA cache scopes so the heavy vendored-upstream Docker layers can be reused across pushes instead of rebuilding the whole pnpm workspace from zero on every run
- Added a no-refresh status sync path to the Home Assistant entry page so operators get a 15-second background status refresh without a full page reload interrupting ongoing actions
- Traced the HA page's `读取失败：返回格式无效` device-approval symptom back to the CLI following a drifted runtime `openclaw.json`: after onboarding, the config could keep `gateway.port=18789` and an empty `gateway.trustedProxies`, so `openclaw devices list --json` was trying the outer HTTPS wrapper instead of the internal loopback gateway and local-client detection behind `ingressd` stopped working
- Fixed the HA UI device actions to call the official `openclaw devices` commands with explicit internal connection arguments (`--url ws://127.0.0.1:18790` plus the current token), making pending-device listing and approval independent from public-port drift in the runtime config
- Added a supervisor-side runtime config reconciliation loop so post-onboarding config edits are pulled back to add-on-required gateway defaults, specifically the internal gateway port, loopback `trustedProxies`, and Control UI allowed origins, without requiring a manual add-on restart
- Confirmed the `Missing workspace template: IDENTITY.md` failure was not caused by the `/config` workspace mapping but by the vendored upstream snapshot missing two package-required template files from Git checkout: `docs/reference/templates/IDENTITY.md` and `USER.md` were present locally but ignored by upstream `.gitignore`, so GH Actions never sent them into the Docker build context
- Verified the OpenClaw template lookup path against upstream (`packageRoot/docs/reference/templates`), then pinned the final image to copy `docs/reference/templates` directly from the vendored upstream source and added add-on-side integrity checks so missing packaged workspace templates now fail immediately at build/startup instead of later during onboarding
- Removed the add-on's implicit "first boot" startup doctor run so `run_doctor_on_start=false` now truly disables `openclaw doctor --fix`; this avoids the new low-memory failure mode where startup doctor, completion indexing, and gateway startup together could still OOM-kill the doctor process on a 2 GB HAOS host
- Confirmed from HAOS kernel logs that `openclaw onboard` was being killed by the kernel OOM killer on a 2 GB system rather than crashing inside upstream wizard logic, then added an add-on runtime `NODE_OPTIONS=--max-old-space-size=512` guard so terminal CLI flows inherit a bounded Node heap
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
