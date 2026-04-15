# Migration Notes

This repository is the current Home Assistant add-on implementation for OpenClaw.

## What changed from the older project naming

- Old public name:
  - `OpenClawHAOSAddon-Rust`
- New public name:
  - `OpenClaw HA Add-on`

## New repository identity

- Repository:
  - `https://github.com/sunboss/openclaw-ha-addon`
- Image:
  - `ghcr.io/sunboss/openclaw-ha-addon`
- Add-on slug:
  - `openclaw_ha_addon`

## Behavioral direction

Compared with older builds, the add-on now aims for:

- a thinner Home Assistant entry page
- a single primary HTTPS Gateway path
- a direct maintenance Shell path
- fewer experimental or duplicate helper routes
- closer alignment with official OpenClaw runtime structure

## Config migration notes

The add-on configuration page now focuses on fields that are actually consumed by the runtime.
Legacy wrapper-only toggles that no longer drive real behavior should not be reintroduced unless they are wired end-to-end.
