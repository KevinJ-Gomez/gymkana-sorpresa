---
name: project-ops
description: Coordinates complex Gymkana work across Codex/Astra or Antigravity using role bootstrap, proportional spec/plan consistency, subagents, focused visual validation, convergence and independent review. Use for multi-step feature work, debugging, 3D/performance work, audits or releases.
---

# Gymkana project operations

## Mandatory bootstrap
Before substantive writes, read `AGENTS.md`, `docs/PROJECT-CONSTITUTION.md`, current GitHub `main`, target Issue/PR + latest handoff, relevant skills/docs and the real affected implementation.

Establish `ROLE_BOOTSTRAP_PASS` by declaring: `ROLE`, `CURRENT_MAIN`, `ACTIVE_ISSUE_PR`, `LAST_CANONICAL_HANDOFF`, `ACTIVE_MISSION`, `WRITE_ZONE`, `FORBIDDEN_ZONES`, active-worker dependencies, reviewers, evidence and `STOP_CONDITION`. Also identify superseded/already-completed work. No PASS => no write.

Normative intent (owner + constitution + accepted spec/decisions) and operational reality (`main` + code + PR/CI/handoffs) must be reconciled before writing. Do not derive permanent ownership from a chat/worker name.

## Delivery
1. Infer routine scope and continue through authorized, non-blocked work. Ask only when a material product/design/privacy/release decision cannot be resolved from the existing experience and durable evidence.
2. Keep governance proportional to this temporary project. Do not generate a full spec stack for an obvious microfix.
3. For a material, ambiguous, multiagent, privacy/release or cross-module change, separate `WHAT/WHY` from `HOW`, then run a read-only `SPEC_PLAN_TASKS_CONSISTENCY_GATE` before implementation. Detect contradictions, uncovered requirements, unrequested work, dependency/order errors, write-zone collisions and missing gates.
4. Use requirement/task IDs only when they improve traceability. `[P]` may label parallel work only when dependencies and write-zones prove it safe.
5. Delegate independent read-heavy work when it saves time or improves quality. Prefer subagents for code mapping, visual review, performance investigation, logs and tests. Avoid multiple agents editing the same code area concurrently.
6. Use GPT-6 Astra for genuinely difficult visual/3D work, long-horizon debugging, Computer Use or cross-tool workflows. Antigravity is a valid fallback execution agent under the same repository rules and skills.
7. Validate the behavior actually changed. For visual work, inspect a real rendered view appropriate to the affected support/context.
8. Treat deployments as a budgeted QA/release resource. Read `docs/DEPLOYMENT-POLICY.md`; group related fixes, validate before pushing, avoid empty/artificial commits, and prefer one coherent push/preview per block. Never claim rendered QA for a head that Vercel has not actually deployed.
9. For material visual work explicitly requested by the owner, load `docs/VISUAL-DNA.md`, `docs/DESIGN-LEARNINGS.md` and `.agents/skills/art-direction/SKILL.md`; use the read-only `art-director` before implementation. Keep the process lightweight and proportional.
10. Do not force a fixed number of design directions or a universal pilot. If a genuine material choice is unresolved, explore enough structurally different options to resolve it. Choose validation by actual risk/support: render, short sequence, prototype, partial implementation or target-device view.
11. Require adopted references to have observable manifestations. Do not allow correspondence/romantic styling, 3D or motion to become decorative busywork detached from the actual surprise/pacing.
12. If rendered/owner QA reveals a material failure, update `docs/DESIGN-LEARNINGS.md` with symptom, root cause, missed gate, generalization boundary and `GLOBAL/CATEGORY/PROJECT` classification. Mark reusable lessons `PROPAGATE_TO_BASE` in the handoff; do not propagate project-specific aesthetics to unrelated products.
13. If the concept itself is wrong, reopen it rather than polishing due to sunk cost.
14. For Three.js/R3F changes, consider frame rate, draw calls/triangles when available, GPU/software fallbacks and reduced-motion behavior where relevant.

## Convergence and closeout
15. After substantive implementation run `CONVERGENCE_GATE`: classify material gaps against accepted intent as `MISSING / PARTIAL / CONTRADICTS / UNREQUESTED`. Green CI cannot hide a Critical/High mismatch.
16. Before PR completion, use an independent `project-reviewer` for diff/Issue/spec alignment, convergence, evidence and `ROLE_COMPLIANCE`. Material visual work should reach `VISUAL_QA_READY` unless the owner explicitly accepts a known visual exception.
17. Report `PASS / FAIL / NOT_EXECUTED / PENDING_HUMAN_QA` truthfully. A declared test or skipped downstream gate is not evidence of PASS.
18. Apply the automatic handoff required by `AGENTS.md`: persist material decisions, then before ending push safe changes and leave the Issue/PR with objective, decisions, changed areas/commits, validation, convergence, blockers, explicit status, learning status and exact next action. Never require Kevin to copy the prior conversation.
19. `ROLE_COMPLIANCE` separately verifies mission, write-zone, forbidden scope, reviewer modes, evidence truthfulness and STOP behavior.
20. Routine non-destructive branch/commit/push/PR actions for an owner-assigned task are pre-authorized; destructive Git, privacy-sensitive publication, release/freeze and merge still follow their normal gates.
21. On STOP return to Dirección; do not select the next mission autonomously.
22. User instructions override general skill guidance unless they conflict with mandatory repository or safety constraints.
