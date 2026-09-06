<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Gymkana Sorpresa agent rules

## Source of truth
- Inspect the current code and recent relevant changes before assuming how an interaction works.
- Preserve approved behavior unless the task explicitly changes it.
- Do not claim a visual fix is complete without inspecting a real rendered result when appearance matters.
- GitHub `main`, Issues, active PRs/branches and canonical repository docs are the durable operational memory. Old chats and local plans are secondary context.

## Git rules
- Work from latest `main` on a task branch; do not push directly to `main`.
- For an owner-assigned Issue/task, non-destructive branch creation, commits, pushes and PR creation/update are pre-authorized. Do not ask Kevin to repeat permission for those routine operations.
- Do not use destructive Git operations to discard unknown work. Preserve unrelated local changes.
- Do not merge until required validation/review is complete. Release/freeze and privacy-sensitive changes require the corresponding gates.

## Session handoff protocol — mandatory and automatic
At the start of every substantive task:
1. review current `main`, this file, the target Issue and any relevant active PR/branch;
2. read the relevant skills and inspect the real affected implementation;
3. prefer current GitHub evidence over memory or an old transcript.

During work:
- do not post minute-by-minute notes;
- persist a material decision when it changes scope, navigation/release behavior, privacy/spoiler behavior, architecture, canonical paths, performance strategy or the accepted implementation route;
- if repository structure or a canonical route changes, update the Issue/PR/docs. Local machine paths are never canonical.

Before ending a substantive session, without waiting for Kevin to request it:
1. push safe code/docs changes to the working branch;
2. create or update the PR when appropriate;
3. leave a concise Issue/PR handoff with objective, final decisions, changed files/areas or commits, validation evidence, unresolved risks/blockers, explicit status, and exact next action;
4. reconcile the Issue state if scope/completion changed.

A future ChatGPT/Codex/Antigravity session must be able to reconstruct the task from GitHub without the prior VS Code conversation. Kevin should never need to copy a long plan or summary between agents.

## Agent orchestration
- This repository supports both Codex (including GPT-6 Astra) and Google Antigravity.
- Shared procedures live in `.agents/skills/`; use them instead of duplicating long workflows in prompts.
- Codex project subagent settings live in `.codex/`; Antigravity can use the shared skills and its custom agents under `.agents/agents/`.
- Use GPT-6 Astra for difficult visual/3D work, long-horizon debugging, Computer Use or cross-tool tasks. Prefer cheaper/faster agents for routine scans, logs and mechanical checks.
- If independent work can be parallelized and doing so saves time or improves quality, delegate it. Prefer delegation for exploration, visual review, mobile review, performance analysis and tests.
- Avoid multiple agents editing the same code area concurrently. After parallel investigation, assign one clear implementation owner per coherent change.
- Antigravity is an approved fallback development agent when Codex/Astra quota is constrained, but it must follow the same repository rules and skills.

## Validation
- Start with focused validation for the changed behavior and broaden only when risk or repository requirements justify it.
- For visual work, check relevant mobile and desktop views plus the affected interaction/timer/progression state.
- For Three.js/R3F changes, consider performance and low-capability fallbacks when relevant.
- Use an independent reviewer before considering a substantial PR complete.

## Blender / 3D
- Prefer reproducible, versioned Blender `bpy` scripts and background exports before introducing Blender MCP.
- Do not add a powerful MCP only because it exists; first demonstrate that the scripted workflow is insufficient and review its permissions.
