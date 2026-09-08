# Deployment budget policy

Vercel deployments are a QA/release resource, not the feedback loop for every microchange.

## Permanent rule
- Avoid repeated `change → commit → push → preview` loops inside one coherent block.
- Group related fixes, validate locally and/or in CI first, then push one coherent block when practical.
- Do not create empty commits or artificial pushes only to force a deployment.
- Do not repeatedly redeploy the same head while a platform rate limit is active.
- A Vercel Preview is mainly for rendered/functional QA, integration checks and pre-merge/release evidence.
- When several defects belong to the same block, investigate and fix them together before the next push/preview.
- If Vercel cannot deploy the exact validated head, do not claim rendered QA. Persist an explicit status such as `VERCEL_PREVIEW_BLOCKED` or `RENDERED_QA_PENDING`.
- Reuse/promote an existing deployment only when it corresponds exactly to the commit that needs validation.

## Why
A high-frequency micro-push workflow can exhaust deployment quotas without increasing product confidence. The preferred workflow is:

`investigate → grouped implementation → focused tests → broader CI when required → one push → one preview → human rendered QA`

This policy does not weaken functional, privacy, or visual gates. It only reduces redundant deployments and coordination overhead.
