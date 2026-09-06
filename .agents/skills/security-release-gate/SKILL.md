---
name: security-release-gate
description: Use before release-sensitive Gymkana changes or public launch. Audits hidden/pre-release access, personal media exposure, browser safety, dependencies, performance regressions, and validation evidence.
---

# Gymkana security and release gate

Read `AGENTS.md`, the changed files and the real release flow before reviewing.

## Gate
1. Do not expose private/spoiler content before the intended release path/date through obvious routes, client-only toggles, source metadata or accidental navigation.
2. Treat personal photos/media as private project content: do not leak unrelated files, metadata, local paths or hidden assets.
3. No secrets, credentials or privileged tokens in client code or repository files.
4. Validate user-controlled input and route/query state; avoid unsafe HTML/script injection.
5. External links and embeds must fail safely and not silently navigate to untrusted destinations.
6. 3D/animation/media must degrade gracefully on low-power/mobile/reduced-motion environments.
7. Dependency changes require production audit review; never use forced breaking audit fixes blindly.
8. A release-sensitive visual change requires real browser inspection, not only successful compilation.

## Required evidence
- lint
- TypeScript
- production build
- mobile + desktop browser check for affected flow
- key hidden/release gates checked directly
- security reviewer after meaningful changes
- performance evidence when Three.js, images, video or animation changes materially

Return Critical → High → Medium → Low findings and finish with `BLOCKED` or `READY`.
