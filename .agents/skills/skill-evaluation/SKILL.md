---
name: skill-evaluation
description: Evalúa skills nuevas/mejoradas contra baseline antes de propagarlas globalmente.
---
# Skill evaluation

`SKILL_SOUNDS_GOOD != SKILL_IMPROVES_OUTCOME`.

Define should-trigger/should-not-trigger; usa tareas reales/adversariales; compara `WITH_SKILL` vs `BASELINE`; mide correctness, constraints, evidence, usability y coste de contexto/tiempo; A/B ciego cuando aporta; revisa triggers; adopta solo si mejora resultado/riesgo/coste; compacta y evita duplicación.

Gate: `TRIGGER_TESTED / BASELINE_COMPARED / ADVERSE_CASE / COST_CHECKED / ADOPT_OR_REJECT`.
