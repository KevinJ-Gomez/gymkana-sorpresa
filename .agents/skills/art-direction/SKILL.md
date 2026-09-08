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
- **Material visual change:** run enough discovery/art direction to resolve the actual design risk. Do not force a fixed number of concepts or a fixed prototype format.

## 1. Learn before designing
Read prior learnings and ask which causes apply, how broad they are, and what must not be over-generalized. A prior failure should improve reasoning, not create superstition.

## 2. Intent and context before pixels
Define user job, context, critical actions, expected pace/density, product signature and conventions worth preserving. Distinctive but contextually wrong is still failure.

## 3. Benchmark/reference must become observable
For every principle adopted, write:
`principle → manifestation in this proposal → validation evidence`.

Do not cite references as moodboard credentials. Extract interaction, pacing, hierarchy, density, feedback or media principles without copying protected visual composition.

## 4. Explore only when a real choice exists
When direction is unresolved, explore 2–3 structurally different options in most cases. If a direction is already approved and the work is evolutionary, do not manufacture alternatives.

## 5. Signature system
A recognizable choice must reinforce meaning, atmosphere or interaction. Decoration repeated everywhere is not a signature.

## 6. Remove underspecification before implementation
Specify hierarchy, type behavior, semantic color, surface rules, media role, interaction/motion, responsive behavior, states and reuse of existing tokens/components.

## 7. Validation is adaptive
Choose the smallest representative evidence capable of falsifying the design risk: wireflow, static state, prototype, partial implementation, relevant browser/device render or another project-appropriate method. No universal mobile pilot exists.

## Anti-convergence / anti-basic checks
Look for clusters and causes:
- generic template hierarchy;
- default cards/pills/bento/glow/glass/gradients without reason;
- typography used as identity while function becomes secondary;
- whitespace that reduces useful density without improving clarity;
- important capabilities hidden;
- copy replacing interaction;
- decorative motion/media unrelated to the product verb;
- distinctiveness achieved by discarding useful contextual affordances;
- references cited without visible implementation.

## Required QA lenses
logo-off, brand-swap, AI-smell, context/category-fit, discoverability, density/pace, media-role/motion fit, real content/states/accessibility, rendered evidence and reference-manifestation check.

## Continuous learning contract
When real QA exposes a material issue:
1. record symptom;
2. identify root cause;
3. explain what previous gate missed;
4. define the reusable rule and boundary;
5. classify `GLOBAL`, `CATEGORY` or `PROJECT`;
6. update `docs/DESIGN-LEARNINGS.md` when present;
7. mark `PROPAGATE_TO_BASE` in the handoff for reusable lessons.

Do not merely patch the visual symptom. If the underlying direction failed, reopen it.

## Agent roles
- `art-director`: read-only direction/review/learning diagnosis;
- implementation writer: one coherent owner for code changes;
- reviewers: correctness/risk remain separate gates.

## Output contract
Preflight: `ART_DIRECTION_READY`, `BLOCKED_NEEDS_DIRECTION`, or `NO_ART_DIRECTION_NEEDED`.
Post-review: `VISUAL_QA_READY`, `GENERIC_RISK`, or `VISUAL_FIX_REQUIRED`.

Always include `learning: none` or `learning: DESIGN_LEARNING_NEW (...)` in material visual handoffs.