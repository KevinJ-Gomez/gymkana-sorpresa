---
name: art-direction
description: Defines and reviews distinctive frontend art direction while learning from prior rendered failures. Use for new screens, redesigns, visual systems, layout/theme/typography/color/motion changes, or when UI risks looking generic or contextually wrong.
---

# Learning-aware art direction

The goal is not merely to avoid common AI aesthetics. It is to prevent repeated design failure by converting real QA into reusable design knowledge.

## Sources of truth
Before material visual work read:
1. `AGENTS.md` and target Issue/PR;
2. `docs/VISUAL-DNA.md`;
3. `docs/DESIGN-LEARNINGS.md` when present;
4. approved benchmark/product/design docs;
5. the real rendered/product implementation.

## Classify the change
- **Local maintenance:** preserve current DNA; no concept ceremony.
- **Material visual change:** any new composition, layout hierarchy, media arrangement, navigation placement, substantial state treatment or visual system change. Run enough discovery/art direction to resolve the actual design risk.

A small CSS diff can still be a material composition change.

## 1. Learn before designing
Read prior learnings and ask which causes apply, how broad they are and what must not be over-generalized. A prior failure should improve reasoning, not create superstition.

## 2. Intent, moment and context before pixels
Define user job, context, critical actions, expected pace/density, project signature and the **moment of need** for each contextual control: when can the user actually know the condition and act on it?

## 3. Benchmark/reference must become observable
For every principle adopted, write `principle → manifestation → validation evidence`. Extract interaction, pacing, hierarchy, density, feedback or media principles without copying protected composition.

## 4. Explore only when a real choice exists
When direction is unresolved, explore enough structurally different options to resolve it. If a direction is already approved and work is evolutionary, do not manufacture alternatives.

## 5. Signature system
A recognizable choice must reinforce meaning, atmosphere or interaction. Decoration repeated everywhere is not a signature.

## 6. Remove underspecification before implementation
For material composition, specify enough before coding that the writer is not forced to invent a default card/rectangle: hierarchy/location, type behavior, semantic color, surface rules, media role, motion, responsive transformation, real states and components/tokens to reuse. Flag `BOLTED_ON_FEATURE` risk when a capability has no natural architectural placement.

## 7. Related media = one stage
When several visuals explain one action/reveal, compose them as a shared scene/stage. Avoid unrelated bordered widgets, leftover gutters, competing captions and detached controls.

## 8. Pixel evidence
For post-implementation material visual QA, exact-HEAD rendered pixel evidence is mandatory. `viewport/overflow PASS` is only `LAYOUT_FIT_PASS`. Evidence must include representative real content and likely failure states: open/closed, media present/missing, fallback, long copy, active/disabled, overlays and relevant target sizes/devices.

## Anti-convergence / anti-basic checks
Look for clusters and causes: generic hierarchy; default cards/pills/glow/glass without reason; bolted-on feature blocks; whitespace harming task clarity; contextual controls before their moment of need; copy replacing interaction; related media fragmented into widgets; empty/broken-looking regions; essential low-contrast text; references cited without visible implementation.

## Required QA lenses
logo-off, brand-swap, AI-smell, context/category-fit, discoverability, density/pace, bolted-on-feature, moment-of-need, related-media, empty/fallback integrity, media/motion fit, real states/accessibility, exact-HEAD render and reference-manifestation check.

## Evidence semantics
Use `PASS / FAIL / NOT_EXECUTED / PENDING_HUMAN_QA` where relevant. Owner QA can supersede an earlier visual approval. Never return `learning:none` after a material owner-visible failure.

## Continuous learning
Record symptom, root cause, missed gate, reusable rule/boundary and `GLOBAL/CATEGORY/PROJECT`. Update `docs/DESIGN-LEARNINGS.md` and mark reusable lessons `PROPAGATE_TO_BASE`.

Do not merely patch a failed visual concept; reopen it when the direction itself is wrong.

## Agent roles
- `art-director`: read-only direction/review/learning diagnosis;
- implementation writer: one coherent owner;
- other reviewers: correctness/risk remain separate gates.

## Output contract
Preflight: `ART_DIRECTION_READY`, `BLOCKED_NEEDS_DIRECTION`, or `NO_ART_DIRECTION_NEEDED`.
Post-review: `VISUAL_QA_READY`, `GENERIC_RISK`, or `VISUAL_FIX_REQUIRED`.