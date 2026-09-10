# Gymkana Sorpresa — Project Constitution

Version: 0.1.0  
Ratified: 2026-09-10  
Last amended: 2026-09-10

## Mission
Entregar una experiencia de sorpresa coherente, fiable y visualmente cuidada sin convertir un proyecto temporal en una plataforma sobredimensionada. La narrativa, el timing, el spoiler-control y la facilidad de uso tienen prioridad sobre complejidad técnica ornamental.

## Non-negotiable principles

### P-001 — Preserve the surprise
**MUST:** navegación, timers, previews, metadatos, logs y estados visibles no deben revelar contenido antes del momento previsto.

### P-002 — Lightweight by design
**MUST:** no introducir 3D, hardening, infraestructura, agentes o documentación pesada si no resuelven un riesgo o necesidad real del proyecto.

### P-003 — Real rendered behavior
**MUST:** cambios visuales o de interacción materiales se validan en un render/estado real apropiado. Código/CI por sí solos no prueban calidad visual.

### P-004 — Privacy and publication safety
**MUST:** proteger contenido privado/sorpresa, secretos y datos sensibles; publicación/release siguen gates explícitos.

### P-005 — Preserve approved identity and pacing
**SHOULD:** mantener la identidad de correspondencia/recuerdo y el ritmo narrativo aprobados sin convertirlos en decoración que dificulte la tarea.

## Source-of-truth policy
- **Normative intent:** decisiones actuales del owner + esta constitución + specs/decisiones aceptadas.
- **Operational reality:** GitHub `main`, código, Issues, PRs, CI, previews verificadas y handoffs.

Si divergen, reconciliar antes de escribir. No usar memoria de chat como sustituto.

## Agent governance
- Trabajo sustantivo requiere `ROLE_BOOTSTRAP_PASS` antes de escribir.
- Declarar rol, main/Issue/PR/handoff, misión, write-zone, prohibiciones, dependencias, reviewers, evidencia y STOP.
- Un writer por zona solapada; reviewers read-only salvo misión explícita.
- `ROLE_COMPLIANCE` es independiente de CI.
- STOP significa no seleccionar otra misión por iniciativa propia.

## Proportional spec-driven delivery
- Microfix: Issue/aceptación + validación focal + handoff.
- Feature mediana: spec ligera + plan/tareas cuando aporten claridad.
- Cambio material/multiagente/privacidad/release: `spec → consistency → plan/tasks → implementation → convergence → reviewers`.

`SPEC_PLAN_TASKS_CONSISTENCY_GATE` busca contradicciones, requisitos sin tarea, trabajo no solicitado, dependencias erróneas, colisiones de writer y gates omitidos.

`CONVERGENCE_GATE` clasifica gaps: `MISSING / PARTIAL / CONTRADICTS / UNREQUESTED`.

No convertir estos gates en burocracia ritual: la profundidad depende del riesgo real.

## Learning and amendments
Los fallos reales generan causa raíz y clasificación `PROJECT / CATEGORY / GLOBAL`. Los aprendizajes globales/categoría se propagan sin copiar la estética específica de Gymkana a otros productos. Cambios en principios `MUST` se versionan y las reglas anteriores se marcan `SUPERSEDED` cuando corresponda.
