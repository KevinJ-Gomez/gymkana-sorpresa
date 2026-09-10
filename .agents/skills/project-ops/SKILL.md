---
name: project-ops
description: Coordinates complex Gymkana work across Codex/Astra or Antigravity using role bootstrap, proportional spec/plan consistency, subagents, focused visual validation, convergence and independent review. Use for multi-step feature work, debugging, 3D/performance work, audits or releases.
---

# Gymkana project operations

## Mandatory bootstrap
Before substantive writes, read `AGENTS.md`, `docs/PROJECT-CONSTITUTION.md`, current GitHub `main`, target Issue/PR + latest handoff, relevant skills/docs and the real affected implementation.

Establish `ROLE_BOOTSTRAP_PASS` by declaring: `ROLE`, `CURRENT_MAIN`, `ACTIVE_ISSUE_PR`, `LAST_CANONICAL_HANDOFF`, `ACTIVE_MISSION`, `WRITE_ZONE`, `FORBIDDEN_ZONES`, active-worker dependencies, reviewers, evidence and `STOP_CONDITION`. Also identify superseded/already-completed work. No PASS => no write.

Normative intent (owner + constitution + accepted spec/decisions) and operational reality (`main` + code + PR/CI/handoffs) must be reconciled before writing. Do not derive permanent ownership from a chat/worker name.

## Mission contract — proportional
For material/cross-surface work, normalize the current instruction into `OBJECTIVE / INVARIANTS / NEGATIVE_CASES / EVIDENCE`. `MORE_PROMPT_TEXT != BETTER_SPEC`: mark obsolete instructions `SUPERSEDED` instead of accumulating clauses.

Run `CROSS_FEATURE_IMPACT_AUDIT` when the change affects timer/reveal progression, shared route/session state, media/assets, multiple screens, persistence, privacy/spoiler access or Three.js/runtime fallback. `LOCAL_REQUIREMENT_PASS != SYSTEM_INVARIANTS_PASS`.

## Delivery
1. Infer routine scope and continue through authorized, non-blocked work. Ask only when a material product/design/privacy/release decision cannot be resolved from existing evidence.
2. Keep governance proportional. Do not generate a full spec stack for an obvious microfix.
3. For material/ambiguous/multiagent/privacy/release/cross-module changes, separate `WHAT/WHY` from `HOW`, then run `SPEC_PLAN_TASKS_CONSISTENCY_GATE` before implementation.
4. Use requirement/task IDs only when useful. `[P]` only when dependencies/write-zones prove it safe.
5. Delegate independent read-heavy work when useful; one writer per overlapping area.
6. Use high-cost reasoning only where complexity justifies it.
7. Validate the behavior actually changed. For visual work inspect real rendered evidence.
8. Treat deployments as budgeted QA; do not manufacture redeploy loops.
9. For material visual work load current visual docs/skill and use read-only `art-director` before implementation.
10. Do not force variants/pilots for ceremony; choose evidence that can falsify the risky hypothesis.
11. References must have observable manifestations; 3D/motion must serve reveal/pacing.
12. Material owner/QA failure updates design learning with symptom/root cause/missed gate/boundary/classification.
13. If concept failed, reopen rather than polish due to sunk cost.
14. For Three.js/R3F consider frame rate, GPU/software fallback and reduced motion when relevant.

## Evidence validity
`PROXY_PASS != USER_OUTCOME_PASS`. Build success, DOM presence, loaded asset or timer existence proves only that property. Outcome claims require corresponding evidence: reveal order, visible/useful media, interaction lifecycle, privacy boundary, target-device performance, etc.

## Convergence and closeout
15. After substantive implementation run `CONVERGENCE_GATE`: `MISSING / PARTIAL / CONTRADICTS / UNREQUESTED`.
16. Use independent `project-reviewer` for diff/spec/impact/evidence/convergence/role compliance.
17. For material work reviewer runs `ADVERSARIAL_REVIEW_GATE`: try plausible counterexamples such as reload/back/navigation during reveal, duplicate/repeated action, timer boundary, missing media, narrow viewport, low-power fallback and direct spoiler URL.
18. Report `PASS / FAIL / NOT_EXECUTED / PENDING_HUMAN_QA` truthfully.
19. Handoff includes objective, relevant invariants/negative cases, changes, validation, cross-feature/adversarial evidence, convergence, blockers and next action.
20. `ROLE_COMPLIANCE` independently verifies mission/write-zone/evidence/STOP.
21. Routine non-destructive Git for assigned work is pre-authorized; destructive/privacy/release/merge remains gated.
22. On STOP return to Dirección; do not choose next mission.
23. User instructions override general skill guidance unless safety/repository constraints conflict.

## Proportionality rule
A trivial local microfix does not need these full gates. Use them when the failure could escape the local component or when user-visible/privacy/release risk is material.
