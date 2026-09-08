---
name: project-ops
description: Coordinates complex Gymkana work across Codex/Astra or Antigravity using subagents, focused visual validation and independent review. Use for multi-step feature work, debugging, 3D/performance work, audits or releases.
---

# Gymkana project operations

1. Read `AGENTS.md` and inspect current GitHub/implementation state before acting.
2. Infer routine scope and continue through authorized, non-blocked work. Ask only when a material product/design decision cannot be resolved from the existing experience.
3. Delegate independent read-heavy work when it saves time or improves quality. Prefer subagents for code mapping, visual review, performance investigation, logs and tests. Avoid multiple agents editing the same code area concurrently.
4. Use GPT-6 Astra for genuinely difficult visual/3D work, long-horizon debugging, Computer Use or cross-tool workflows. Antigravity is a valid fallback execution agent under the same repository rules and skills.
5. Validate the behavior actually changed. For visual work, inspect a real rendered view appropriate to the affected support/context.
6. Treat deployments as a budgeted QA/release resource. Read `docs/DEPLOYMENT-POLICY.md`; group related fixes, validate before pushing, avoid empty/artificial commits, and prefer one coherent push/preview per block. Never claim rendered QA for a head that Vercel has not actually deployed.
7. For material visual work explicitly requested by the owner, load `docs/VISUAL-DNA.md`, `docs/DESIGN-LEARNINGS.md` and `.agents/skills/art-direction/SKILL.md`; use the read-only `art-director` before implementation. Keep the process lightweight and proportional to this temporary project.
8. Do not force a fixed number of design directions or a universal pilot. If a genuine material choice is unresolved, explore enough structurally different options to resolve it. Choose validation by actual risk/support: render, short sequence, prototype, partial implementation or target-device view.
9. Require adopted references to have observable manifestations. Do not allow correspondence/romantic styling, 3D or motion to become decorative busywork detached from the actual surprise/pacing.
10. If rendered/owner QA reveals a material failure, update `docs/DESIGN-LEARNINGS.md` with symptom, root cause, missed gate, generalization boundary and `GLOBAL/CATEGORY/PROJECT` classification. Mark reusable lessons `PROPAGATE_TO_BASE` in the handoff; do not propagate project-specific aesthetics to unrelated products.
11. If the concept itself is wrong, reopen it rather than polishing due to sunk cost.
12. For Three.js/R3F changes, consider frame rate, draw calls/triangles when available, GPU/software fallbacks and reduced-motion behavior where relevant.
13. Before PR completion, use an independent reviewer. Material visual work should reach `VISUAL_QA_READY` unless the owner explicitly accepts a known visual exception.
14. Apply the automatic handoff required by `AGENTS.md`: persist material decisions, then before ending push safe changes and leave the Issue/PR with objective, decisions, changed areas/commits, validation, blockers, explicit status, design learning status and exact next action. Never require Kevin to copy the VS Code conversation or remind you to hand off.
15. Routine non-destructive branch/commit/push/PR actions for an owner-assigned task are pre-authorized; destructive Git, privacy-sensitive publication, release/freeze and merge still follow their normal gates.
16. User instructions override general skill guidance unless they conflict with mandatory repository or safety constraints.
