# Gymkana Sorpresa — Visual DNA

Status: lightweight art-direction guardrail. Gymkana is a temporary private surprise, not a product that needs an expensive permanent design system. Do not create redesign work merely to satisfy this document.

## Product essence
Gymkana is an **intimate sequence of correspondence, anticipation and discovery between two people**. It should feel authored and personal: part letter, part keepsake, part staged reveal.

It is not a SaaS, game dashboard, wedding template or generic Valentine's microsite.

## Memory test
The visual memory should be:

> **A private letter that slowly turns into an experience.**

If the memory is only "pink romantic website" or "3D heart app", the result is too generic.

## Core adjectives
- **Intimate** — personal scale and language, never mass-market romance.
- **Tactile** — paper, ink, seal, velvet/petal tones and physical correspondence inform the surfaces.
- **Theatrical** — timing and reveal create anticipation without becoming a game HUD.

## Anti-adjectives
- generic Valentine / wedding template;
- SaaS/app dashboard;
- casino/game HUD;
- neon cyber-romance;
- overproduced 3D showcase.

## Existing visual anchors
The current implementation already contains a strong project-specific language:
- Baskerville/Iowan/Palatino-style serif hierarchy;
- Avenir Next/Segoe UI sans for utility text;
- rose/petal + deep plum/velvet palette;
- invitation paper, ruled texture, envelope and irregular wax seal;
- chapter/day numbering;
- full-screen journey/3D context.

Treat these as approved anchors unless the owner explicitly asks for a different direction.

## Source metaphors
- handwritten/formal correspondence and envelopes;
- book chapters, marginalia and dated letters;
- wax, paper grain, ribbon, velvet and pressed petals;
- theatre/program pacing: anticipation → reveal → pause → next act;
- intimate photo albums/keepsakes when actual approved photos are involved.

Extract principles, not literal clip-art motifs.

## Signature system
### 1. Correspondence
Headers, dates, rules, chapter markers and copy may feel like authored correspondence. The invitation/envelope/seal is a real signature, not a one-off decorative gimmick.

### 2. Chapter pacing
Day/reveal states should feel sequential. Large chapter numerals, pauses and deliberate transitions can carry progress better than generic progress bars/cards.

### 3. Imperfect physical detail
Small controlled irregularities — seal silhouette, paper grain, offset letter angle — help the piece feel made rather than generated. Do not scatter random rotations/noise across all controls.

### 4. 3D as a reveal, not chrome
The heart/nebula context is special because it belongs to the surprise. Do not add more 3D simply to increase visual complexity. 3D must preserve performance and the emotional/narrative focus.

## Composition grammar
- Let invitation/letter layouts use centered ceremony where appropriate, but journey/day content can become more editorial and left-led.
- Use rules, chapters, paper edges and text rhythm before generic cards.
- Keep the main reveal/action obvious even when the atmosphere is rich.
- Avoid adding dashboard navigation or feature grids; the experience is linear/episodic.

## Color and material language
Current rose/petal/plum palette is approved. Use it tonally rather than turning every element bright pink.

- light paper: cream/blush with ink-like plum text;
- dark journey: velvet/plum/near-black with petal highlights;
- wax/rose accent for meaningful focus/reveal;
- gradients may model depth/material, not generic "premium" glow.

## Typography
The current serif + utility sans pairing is part of the personality. Do not replace it with a generic modern grotesk to "clean it up".

- serif carries letters, titles, chapter numbers and emotional lines;
- sans carries utility/status/control text;
- preserve readable Spanish, long clues and mobile fit;
- avoid excessive all-caps/tracking outside metadata/date-like roles.

## Motion language
Motion is **reveal and handling**:
- opening, unfolding, turning, approaching, focusing;
- short tactile press responses;
- transitions between chapters/days;
- restrained ambient 3D only where already justified.

Avoid identical fade-up animations everywhere, confetti without narrative reason, or motion that risks spoilers/timer mistakes.

## Anti-generic checks
Return `GENERIC_RISK` if several appear together:
- generic pink gradient CTA/card system replaces letter/material language;
- every clue/day becomes a rounded app card;
- generic heart icons replace authored details;
- app chrome/nav becomes more prominent than the story;
- additional 3D/particles exist only because they look impressive;
- the page could be a wedding RSVP/Valentine template after swapping copy.

## Priority constraint
Gymkana is deliberately low-priority and temporary. Use this DNA only when a requested visual change is material. Do not spend release/security/design effort that does not improve whether the surprise works, reads well and feels personal for the two intended people.

## Canonical relationship
- Behavior/timers/spoilers: code, Issues and `AGENTS.md`.
- Artistic intent: this file.
- Method/QA: `.agents/skills/art-direction/SKILL.md`.
