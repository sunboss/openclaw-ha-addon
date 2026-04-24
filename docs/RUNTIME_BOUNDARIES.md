# Runtime Boundaries

This note keeps the HAOS add-on aligned with the official OpenClaw install docs while preserving the current Hermes-style thin shell.

## Probe model

| Endpoint | Meaning | Intended use |
| --- | --- | --- |
| `/healthz` | Liveness only | Confirms ingress is alive |
| `/readyz` | Gateway readiness | Confirms the supervisor-managed gateway is actually ready |
| `/health` | JSON readiness wrapper | For UI callers that want structured output |

Rules:

- Keep all three endpoints lightweight.
- Do not call heavy CLI health commands during boot just to answer readiness.
- Startup doctor output is not the same thing as readiness.

## Directory boundary

| Category | Path | Notes |
| --- | --- | --- |
| OpenClaw config file | `/config/.openclaw/openclaw.json` | HA persistent mirror of upstream `~/.openclaw/openclaw.json` |
| MCPorter config file | `/config/.mcporter/mcporter.json` | MCP server registration |
| OpenClaw state root | `/config/.openclaw` | HA persistent mirror of upstream `~/.openclaw` |
| Workspace | `/config/.openclaw/workspace` | HA persistent mirror of upstream `~/.openclaw/workspace` |
| Runtime pid dir | `/run/openclaw-rs` | Ephemeral runtime state only |
| Shared runtime files | `/run/openclaw-rs/public` | Gateway token and CA handoff files |
| Compile cache | `/var/tmp/openclaw-compile-cache` | Node/OpenClaw compile cache |
| Certificates | `/config/certs` | Persistent TLS assets |

Current interpretation:

- The add-on keeps official upstream layout semantics, but relocates them onto Home Assistant persistent storage under `/config`.
- Treat `openclaw.json` and `mcporter.json` as config files.
- Treat sessions, identity, memory, extensions, and workspace as state rooted under `/config/.openclaw`.
- `/root/.openclaw` is only a compatibility symlink that points back to `/config/.openclaw`, so upstream code that still resolves `~/.openclaw` continues to work unchanged.
- The add-on should not reintroduce extra HA-only overlay config files unless the single-page shell genuinely needs them.

## UI shell boundary

The HA UI is intentionally a thin single page:

- `打开网关`
  - direct new-window jump into the upstream Gateway Control UI
- `维护 Shell`
  - direct new-window jump into the full `ttyd` Web Shell
- `Gateway 状态`
  - one small readiness/status block only
- `显示 Gateway Token`
  - reveal/copy token when needed
- `授权提醒`
  - list devices
  - approve latest

Rules:

- Do not reintroduce local multi-page config/log/command shells.
- Do not rebuild a local terminal frontend when `ttyd` or the upstream Gateway already provides the real surface.
- Keep the HA page as a launch-and-status shell, not a second control plane.
