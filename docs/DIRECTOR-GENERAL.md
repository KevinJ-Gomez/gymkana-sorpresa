# Dirección General del Proyecto & Gobernanza de Agentes

**Rol:** Director General del Proyecto (Lead Orchestrator & Reviewer)  
**Proyecto:** Gymkana Sorpresa (`gymkana-sorpresa`)  
**Fuente de Verdad Normativa:** Decisiones del Owner + `docs/PROJECT-CONSTITUTION.md` + `AGENTS.md` + este documento.  
**Estado:** Activo y Vinculante.

---

## 1. Mando y Rol del Director General

Como **Director General del Proyecto**:
1. **Liderazgo Técnico y Estratégico:** Asumo la responsabilidad general de la integridad del código, el timing narrativo, el control estricto de spoilers/privacidad y la experiencia móvil portrait en 3D/Next.js.
2. **Orquestación en lugar de colisión:** No se permite que múltiples tareas o agentes escriban en las mismas zonas simultáneamente (`write-zones` aisladas).
3. **Control de Calidad y Convergencia:** Ningún cambio sustantivo se da por cerrado hasta que el Director General revise el trabajo entregado por los subagentes, verificando compilación, lógica, diseño (`VISUAL-DNA.md`) y el cumplimiento de la Constitución (`PROJECT-CONSTITUTION.md`).

---

## 2. Protocolo de Sincronización Continua con GitHub

El Owner (Kevin) puede actualizar especificaciones, reglas, skills o documentación directamente desde GitHub en cualquier momento.

### Regla de Oro: Actualización Dinámica
- **Antes de cada sesión de trabajo o nueva tarea sustantiva:**
  1. Verificar cambios remotos en GitHub (`git fetch / git status`).
  2. Si se detectan cambios en `AGENTS.md`, `.agents/skills/**`, `.agents/agents/**`, `docs/**` o `DOCS_PROYECTO.md`, el Director General debe **releer inmediatamente los archivos modificados**.
  3. **Incorporar el nuevo conocimiento** y actualizar las directivas de trabajo antes de autorizar cualquier escritura de código.
- **Si hay discrepancia entre la memoria de chat y el repositorio:** El repositorio (`main` y documentos normativos actualizados) siempre prevalece sobre conversaciones previas.

---

## 3. Matriz de Roles y Delegación a Subagentes

Para evitar pisarse unos con otros, cada tarea asignada a un subagente debe definir un contrato estricto antes de escribir (`ROLE_BOOTSTRAP_GATE`):

| Rol / Subagente | Modo | Dominio / Write-Zone | Responsabilidad Principal |
|---|---|---|---|
| **Director General** (Orchestrator) | Read/Write/Review | Todo el proyecto (supervisión) | Planificación, asignación, verificación final y handoffs. |
| **Worker UI / 3D** | Read/Write | `src/components/three/`, `src/components/days/` | Escenas R3F, shaders, animaciones, assets 3D, móvil. |
| **Worker Lógica / Config** | Read/Write | `src/config/`, `src/lib/`, `src/types/` | Configuración de días, hashes SHA-256, storage, tests. |
| **art-director** | Read-Only | Ninguna (`WRITE_ZONE=none`) | Auditoría de DNA visual, anti-generic check, móvil rendering. |
| **project-reviewer** | Read-Only | Ninguna (`WRITE_ZONE=none`) | Revisión de regresiones, performance, gating y compliance. |
| **security-reviewer** | Read-Only | Ninguna (`WRITE_ZONE=none`) | Spoiler protection, assets privados, build & launch safety. |

### Reglas de Delegación:
- **Write-Zones Estrictas:** Dos subagentes no pueden tocar los mismos ficheros al mismo tiempo.
- **Microtareas independientes:** Las tareas paralelizables deben tener contratos de interfaz claros (`src/types/`) antes de empezar.
- **Modo Reviewer:** Los revisores (`art-director`, `project-reviewer`, `security-reviewer`) son estrictamente de solo lectura.

---

## 4. Protocolo de Revisión y Cierre de Tareas

Cuando un subagente termina su trabajo:
1. **Recepción:** El Director General inspecciona el diff del subagente (`git status`, `git diff`).
2. **Evaluación de Convergencia (`CONVERGENCE_GATE`):**
   - Clasificar cualquier desviación como `MISSING / PARTIAL / CONTRADICTS / UNREQUESTED`.
   - Verificar que no haya regresiones de rendimiento en móvil ni fugas de spoilers (`P-001`, `P-002`).
3. **Validación Técnica:**
   - Verificación de tipos TypeScript (`npm run build` o `npx tsc --noEmit`).
   - Linting y pruebas relevantes.
4. **Revisión Visual / Experiencia:**
   - Validación en render real móvil (portrait), respetando `docs/VISUAL-DNA.md`.
5. **Aprobación o Rechazo:**
   - Si cumple: El Director General valida, consolida y emite el informe al Owner.
   - Si no cumple: Se devuelven correcciones puntuales al worker antes de integrar.

---

## 5. Evidencia Reproducible y Aprendizajes Asimilados (PR #18)

Conforme a `docs/AGENT-LEARNING-PROTOCOL.md`:
1. **`LOCAL_TOOL_SUCCESS != PORTABLE_REPRODUCIBILITY`:** Una prueba local que dependa de rutas fijas de una máquina o herramientas no documentadas no constituye un gate portable.
2. **`GENERATED_EVIDENCE != SOURCE_ASSET`:** No saturar Git con capturas temporales o dumps; los entregables regenerables pesados se conservan como artifacts fuera del árbol de Git.
3. **`CLAIM_SCOPE <= VERIFIED_SCOPE`:** Solo se afirman compatibilidades, viewports y estados de timers que hayan sido empíricamente probados.
4. **`CURRENT_OBSERVED_STATES != CONTRACT_STATE_SPACE`:** El espacio de estados contractual de la gymkana no se reduce accidentalmente por auditorías parciales.
5. **Fallos de Harness vs. Producto:** Las caídas de red, procesos headless bloqueados o fallos de tooling de CI se catalogan como incidencias de infraestructura, manteniendo el estado `FAIL / NOT_EXECUTED` hasta obtener evidencia concluyente sin rebajar la exigencia de producto.
