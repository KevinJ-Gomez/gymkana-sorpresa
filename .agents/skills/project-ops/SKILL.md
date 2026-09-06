---
name: project-ops
description: Coordinates complex Gymkana work across Codex/Astra or Antigravity using subagents, focused visual validation and independent review. Use for multi-step feature work, debugging, 3D/performance work, audits or releases.
---

# Gymkana project operations

1. Read `AGENTS.md` and inspect current GitHub/implementation state before acting.
2. Infer routine scope and continue through authorized, non-blocked work. Ask only when a material product/design decision cannot be resolved from the existing experience.
3. Delegate independent read-heavy work when it saves time or improves quality. Prefer subagents for code mapping, mobile review, visual review, performance investigation, logs and tests. Avoid multiple agents editing the same code area concurrently.
4. Use GPT-6 Astra for difficult visual/3D work, long-horizon debugging, Computer Use or cross-tool workflows. Antigravity is a valid fallback execution agent under the same repository rules and skills.
5. Validate the behavior actually changed. For visual work, inspect a real rendered view on relevant mobile/desktop sizes.
6. For material visual work explicitly requested by the owner, load `docs/VISUAL-DNA.md` and `.agents/skills/art-direction/SKILL.md`; use `art-director` for lightweight preflight/review when it adds value. Do not turn this temporary surprise into a design-system project or create redesign busywork.
7. For Three.js/R3F changes, consider frame rate, draw calls/triangles when available, GPU/software fallbacks and reduced-motion behavior where relevant.
8. Before PR completion, use an independent reviewer. Material visual work should reach `VISUAL_QA_READY` unless the owner explicitly accepts a known visual exception.
9. Apply the automatic handoff required by `AGENTS.md`: persist material decisions, then before ending push safe changes and leave the Issue/PR with objective, decisions, changed areas/commits, validation, blockers, explicit status and exact next action. Never require Kevin to copy the VS Code conversation or remind you to hand off.
10. Routine non-destructive branch/commit/push/PR actions for an owner-assigned task are pre-authorized; destructive Git, privacy-sensitive publication, release/freeze and merge still follow their normal gates.
11. User instructions override general skill guidance unless they conflict with mandatory repository or safety constraints.
