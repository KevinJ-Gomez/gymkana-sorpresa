---
name: art-direction
description: Defines and reviews distinctive frontend art direction before substantial visual work. Use for new screens, redesigns, layout/theme/typography/color/motion changes, visual systems, or when a UI risks looking generic or AI-generated.
---

# Distinctive art direction

Use this skill to prevent distributional-convergence UI: technically competent interfaces that default to common fonts, gradients, card grids and familiar SaaS patterns because visual intent was underspecified.

## Sources of truth
Before material visual work, read:
1. `AGENTS.md` and the target Issue/PR;
2. `docs/VISUAL-DNA.md`;
3. the existing rendered screen and the actual styles/components it uses;
4. any project-specific design/product docs referenced by `VISUAL-DNA.md`.

`VISUAL-DNA.md` defines artistic intent. Existing components/tokens/code define what already exists in production. Do not recreate a component merely because a prose design description could be implemented from scratch.

## Classify the change
- **Small visual maintenance:** copy fit, alignment, one state, a local spacing/accessibility fix. Apply the current DNA directly; no concept exercise is required.
- **Material visual change:** new route/screen, redesign, new visual pattern, global typography/color/layout/motion change, or a component family. Run the full art-direction workflow and use the `art-director` agent before implementation when available.

## Full workflow

### 1. Intent before pixels
Write a short brief that answers:
- What job is the user doing here?
- Who is using it and in what context/device?
- What should they feel without sacrificing clarity?
- What is the single visual idea they should remember 24 hours later?
- Which 3 adjectives from `VISUAL-DNA.md` must be visible in the result?
- Which anti-adjectives must not appear?

Do not start from "modern", "premium", "clean" or another vague adjective alone.

### 2. Reference principles, not template copying
When fresh references would materially improve the result, research deliberately. Prefer a mixed reference set rather than five websites from the same category:
- editorial/print;
- architecture/interiors or industrial/product design;
- photography/film/fashion/packaging/signage appropriate to the product;
- at most a small number of digital interfaces for interaction mechanics.

For each reference, extract a principle (rhythm, hierarchy, crop, contrast, material, motion, geometry), not a component to copy. Never copy proprietary assets or an exact protected composition.

### 3. Explore genuinely different directions
If the project has no already-approved direction for the requested surface, propose 2–3 directions that differ structurally, not just by palette. Vary hierarchy, density, grid, type behavior, image role, surface language and motion. Select/recommend one against product fit, usability, accessibility, performance and the DNA.

Do not generate three versions that are all "hero + cards" with different colors.

### 4. Define a signature system
Every material surface should inherit at least one recognizable project signature from `VISUAL-DNA.md`. A signature may be typography behavior, composition, a line/shape system, data treatment, imagery crop, transition language or another contextual motif.

A signature is not decoration repeated everywhere. It must reinforce meaning or atmosphere.

### 5. Remove underspecification before code
The implementation brief should state only what is needed for this task:
- hierarchy and composition;
- typography roles/behavior;
- semantic color roles;
- shape/surface rules;
- imagery/iconography rules;
- interaction/motion behavior;
- responsive transformation;
- states that must be designed (loading, empty, error, disabled, focus, overflow/multilingual when relevant);
- existing components/tokens to reuse.

Prefer semantic tokens and shared components over scattered one-off values. Do not create a parallel design system inside a feature.

## Anti-convergence rules
Never use these merely because they are easy or statistically common:
- centered hero + generic subtitle + two CTAs;
- automatic three-card feature row or bento grid;
- a rounded card around every content group;
- universal pill-shaped controls/labels;
- purple/blue aurora gradients or glow as generic "premium/AI" shorthand;
- glassmorphism/backdrop blur as default atmosphere;
- Inter/Roboto/Arial/system font as an unexamined new identity choice;
- Space Grotesk as the automatic "different" replacement;
- Lucide icons placed in colored circles as decoration rather than information;
- decorative blobs, grid backgrounds, starbursts or noise unrelated to the product metaphor;
- identical fade-up/slide-up animation on every section;
- perfectly symmetric spacing and repeated component proportions when content hierarchy calls for variation;
- fake metrics, testimonials, activity, recommendations, artwork or data to make a layout look complete.

These patterns are not banned. If one is genuinely the best solution, document the product/interaction reason and adapt it to the project DNA.

## Distinctiveness gates
Before declaring material visual work complete, run all of these:

### Logo-off test
Imagine/remove the logo/name. Does the screen still have recognizable project character? If it could belong unchanged to an unrelated SaaS/fintech/AI app, return `GENERIC_RISK`.

### Brand-swap test
Could the product name be replaced with an unrelated brand while the visual concept still makes equal sense? If yes, strengthen context-specific choices.

### AI-smell audit
Check for accumulated defaults: generic type, excessive cards/pills, unjustified gradients/glow/glass, template hierarchy, decorative icon containers, repetitive motion, arbitrary radii/shadows. One justified pattern is fine; a cluster is a warning.

### Content/states test
Inspect real or representative content, long text, empty/error/loading states, focus/keyboard behavior and relevant responsive sizes. Visual novelty never overrides readability, accessibility or task completion.

### Rendered-evidence test
Do not approve by reading JSX/CSS alone. Inspect a real rendered browser/device view at the relevant mobile and desktop sizes. For substantial work, compare before/after and record what was visually verified in the PR/handoff.

## Agent roles
- `art-director`: read-only preflight/reviewer. It defines direction, challenges generic defaults and performs the distinctiveness audit.
- implementation agent: one writer owns the coherent code area and implements the approved direction using existing code/tokens/components.
- project/security reviewer: still checks correctness, regressions, privacy/security and required validation. Art direction does not replace engineering review.

## Output contract
A preflight ends with one of:
- `ART_DIRECTION_READY` — enough intent/constraints exist to implement;
- `BLOCKED_NEEDS_DIRECTION` — a material visual/product choice genuinely needs owner input;
- `NO_ART_DIRECTION_NEEDED` — change is local maintenance.

A post-implementation review ends with:
- `VISUAL_QA_READY` — rendered result fits DNA and passes distinctiveness/usability checks;
- `GENERIC_RISK` — functional but visually interchangeable; list concrete corrections;
- `VISUAL_FIX_REQUIRED` — identifiable visual/usability/accessibility defects remain.

Persist only material visual decisions in the Issue/PR or canonical design docs. Do not create minute-by-minute design logs.