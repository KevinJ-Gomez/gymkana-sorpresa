---
name: project-capabilities
description: Router de capacidades especializadas del proyecto. Cárgalo cuando una misión dependa de MCP/plugins/skills externas, APIs cambiantes, frontend/runtime, accesibilidad, debugging o motion material.
---
# Project capability routing

`ALL_AGENTS_KNOW_ROUTING != ALL_SKILLS_ALWAYS_LOADED`.

Carga solo la skill que cierre el riesgo de la misión:
- MCP/plugin/conector/skill externa -> `external-capability-intake`.
- Framework/API/SDK cambiante -> `source-driven-development`.
- React/Next/web/runtime/performance -> `frontend-runtime-quality`.
- Accesibilidad -> `accessibility-quality`.
- Bug/test/build roto -> `debugging-recovery`.
- Nueva/mejorada skill -> `skill-evaluation` antes de escalarla globalmente.
- Motion/animación material -> `motion-design` + art direction cuando afecte percepción/composición.

Reglas: `MCP_COUNT != CAPABILITY_QUALITY`; `MCP_AVAILABLE != MCP_JUSTIFIED`; `CURRENT_OFFICIAL_DOCS + INSTALLED_VERSION > MODEL_MEMORY`; `DEVTOOLS_DIAGNOSES`; `PLAYWRIGHT_REPEATS`.
Preferir CLI/native cuando da evidencia equivalente con menor coste de contexto; MCP cuando aporta estado/datos/acciones/introspección viva.
