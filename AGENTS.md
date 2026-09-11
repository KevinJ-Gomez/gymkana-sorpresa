<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Gymkana Sorpresa agent rules

## Source of truth
- Normative intent = current owner decisions + `docs/PROJECT-CONSTITUTION.md` + accepted Issue/spec/decisions.
- Operational reality = current GitHub `main`, code, active Issues/PRs, CI/previews and durable handoffs.
- Reconcile both before writing. Preserve approved behavior unless the task explicitly changes it.
- Old chats and local plans are secondary context.
- Do not claim a visual fix is complete without inspecting a real rendered result when appearance matters.

## ROLE_BOOTSTRAP_GATE — mandatory for substantive work
Before writing, every new/reactivated agent must establish `ROLE_BOOTSTRAP_PASS` by declaring:
- role/mode;
- current main + target Issue/PR + latest handoff;
- one active mission;
- write-zone + forbidden zones;
- active-worker dependencies/collision risk;
- relevant skills/reviewers;
- evidence required + STOP condition;
- superseded/already-completed work not to repeat.

No PASS => no substantive write. A temporary chat/worker name does not create permanent ownership. On STOP, return to Direction rather than selecting another mission autonomously.

## Git rules
- Work from latest `main` on a task branch; do not push directly to `main`.
- For an owner-assigned Issue/task, non-destructive branch creation, commits, pushes and PR creation/update are pre-authorized. Do not ask Kevin to repeat permission for routine operations.
- Do not use destructive Git operations to discard unknown work. Preserve unrelated local changes.
- Do not merge until required validation/review is complete. Release/freeze and privacy-sensitive changes require corresponding gates.

## Proportional spec-driven delivery
Use process according to risk, not ritual:
- obvious microfix: Issue/acceptance + focused validation + handoff;
- medium feature: lightweight WHAT/WHY spec + plan/tasks when useful;
- material/ambiguous/multiagent/privacy/release/cross-module work: `spec → SPEC_PLAN_TASKS_CONSISTENCY_GATE → plan/tasks → implementation → CONVERGENCE_GATE → reviewers`.

`SPEC_PLAN_TASKS_CONSISTENCY_GATE` is read-only and looks for contradictions, uncovered requirements, unrequested tasks, constitution conflicts, terminology drift, dependency/order errors, write-zone collisions and missing/late gates.

After substantive implementation, `CONVERGENCE_GATE` classifies material mismatches against accepted intent as `MISSING / PARTIAL / CONTRADICTS / UNREQUESTED`. Green CI cannot hide a Critical/High mismatch.

## Session handoff protocol — mandatory and automatic
At start of every substantive task:
1. pass `ROLE_BOOTSTRAP_GATE`;
2. review current `main`, this file, `docs/PROJECT-CONSTITUTION.md`, target Issue and relevant active PR/branch;
3. read relevant skills and inspect real affected implementation;
4. reconcile stale handoff/spec against current GitHub and owner intent.

During work:
- do not post minute-by-minute notes;
- persist a material decision when it changes scope, navigation/release behavior, privacy/spoiler behavior, architecture, canonical paths, performance strategy or accepted implementation route;
- if repository structure or a canonical route changes, update Issue/PR/docs. Local machine paths are never canonical.

Before ending a substantive session, without waiting for Kevin to request it:
1. run relevant convergence/domain/reviewer gates;
2. push safe code/docs changes to working branch;
3. create/update PR when appropriate;
4. leave concise Issue/PR handoff with objective, final decisions, changed files/areas/commits, requirement/task mapping when used, validation evidence, convergence, unresolved risks/blockers, explicit status and exact next action;
5. include `ROLE_COMPLIANCE_PASS/FAIL` separately from code/CI correctness;
6. reconcile Issue state if scope/completion changed;
7. STOP.

A future ChatGPT/Codex/Antigravity/other-AI session must reconstruct task from GitHub without prior conversation. Kevin should never need to copy a long plan/summary between agents.

## Visual design gate — distinctive but lightweight
- `docs/VISUAL-DNA.md` is canonical art direction and `.agents/skills/art-direction/SKILL.md` is anti-generic workflow.
- Gymkana is temporary and low-priority: do not create redesign work merely because these files exist.
- When owner explicitly requests a **material** visual change, read DNA/skill first and use read-only `art-director` for lightweight preflight/review when it materially improves result.
- Preserve correspondence/keepsake identity, narrative pacing and spoiler/timer behavior. Do not let an implementation agent turn experience into generic app/SaaS UI while coding.
- Small visual fixes only need preserve existing DNA and be checked in real rendered state.
- Material visual work should pass logo-off, brand-swap and AI-smell gates, but visual polish never justifies extra 3D, performance cost or busywork that does not improve surprise.
- `LAYOUT_FIT_PASS != VISUAL_QA_READY`; material composition requires real pixel evidence appropriate to affected support.

## Agent orchestration
- Repository supports Codex (including GPT-6 Astra) and Google Antigravity; other AIs may work if they obey same provider-neutral project rules.
- Shared procedures live in `.agents/skills/`; use them instead of duplicating long workflows in prompts.
- Provider-specific folders/config are adapters, not a higher authority than project constitution/AGENTS/accepted intent.
- Use GPT-6 Astra for difficult visual/3D work, long-horizon debugging, Computer Use or cross-tool tasks. Prefer cheaper/faster agents for routine scans, logs and mechanical checks.
- If independent work can be parallelized and doing so saves time/improves quality, delegate it. Prefer delegation for exploration, visual review, mobile review, performance analysis and tests.
- Parallel means dependencies satisfied + stable contracts + non-overlapping write-zones. One implementation owner per coherent change.
- Antigravity is approved fallback when Codex/Astra quota is constrained, under same rules/skills.
- `project-reviewer` must evaluate convergence and `ROLE_COMPLIANCE` for substantive work.

## Validation
- Start with focused validation for changed behavior and broaden only when risk/repository requirements justify it.
- Report `PASS / FAIL / NOT_EXECUTED / PENDING_HUMAN_QA` truthfully; a source assertion or skipped downstream gate is not PASS.
- For visual work, check relevant mobile/desktop views plus affected interaction/timer/progression state.
- For Three.js/R3F changes, consider performance and low-capability fallbacks when relevant.
- Use independent reviewer before considering a substantial PR complete.

## Blender / 3D
- Prefer reproducible, versioned Blender `bpy` scripts and background exports before introducing Blender MCP.
- Do not add a powerful MCP only because it exists; first demonstrate scripted workflow is insufficient and review permissions.

## Learning assimilation — lightweight but mandatory for material work
Read `docs/AGENT-LEARNING-PROTOCOL.md` before substantive material work/review.

- `LEARNING_STORED != LEARNING_APPLIED`.
- Select only applicable learnings as `RULE → PAST_FAILURE → MISSION_IMPLICATION → EVIDENCE`; do not recite the whole history.
- Before another correction of a known defect run `REPEAT_FAILURE_GUARD`.
- After two material failures on the same surface/pipeline, stop point-fixing and diagnose/root-cause before another write.
- A shared timer/reveal/route/media/3D pipeline failure is a sentinel for its affected family/states, not only the reported example.
- At material closeout the independent reviewer reports `LEARNING_COMPLIANCE_PASS / FAIL / NOT_APPLICABLE`.
- Repeating a known failed strategy without new diagnosis is `KNOWN_FAILURE_REPETITION` and blocks READY.

Keep this proportional: trivial microfixes do not need a ceremonial ledger recital.
