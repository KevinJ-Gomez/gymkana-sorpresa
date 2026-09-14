---
name: accessibility-quality
description: Diseña y verifica accesibilidad con semántica, teclado, contraste, focus, formularios, motion reducido y pruebas automatizadas/manuales.
---
# Accessibility quality

`ACCESSIBLE_OUTCOME > AUTOMATED_SCORE`.

Preferir controles nativos; verificar nombre/rol/estado/labels/headings; teclado/focus sin traps; color no es único portador; formularios con label/error/autocomplete cuando aplica; `prefers-reduced-motion` como estado de producto; axe/Playwright ayudan pero no sustituyen teclado, zoom/reflow, orden y comprensión. Re-verificar tras remediation.

Gate: `SEMANTICS / KEYBOARD / FOCUS / CONTRAST_STATE / FORMS_WHEN_APPLICABLE / REDUCED_MOTION / AUTOMATED_SCAN_WHEN_AVAILABLE / MANUAL_RISK_CHECK`.
