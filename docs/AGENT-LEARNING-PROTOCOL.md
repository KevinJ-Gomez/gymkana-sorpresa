# Gymkana — Learning Assimilation Protocol

Aplicar proporcionalmente; Gymkana debe seguir ligera.

Reglas:
- `LEARNING_STORED != LEARNING_APPLIED`.
- `LEARNING_PROPAGATED != LEARNING_ASSIMILATED`.
- repetir una estrategia ya refutada sin nueva causa = `KNOWN_FAILURE_REPETITION`.

Para trabajo material:
1. seleccionar solo learnings aplicables como `RULE → PAST_FAILURE → MISSION_IMPLICATION → EVIDENCE`;
2. antes de corregir un fallo conocido, ejecutar `REPEAT_FAILURE_GUARD`;
3. tras dos FAIL materiales del mismo surface/pipeline, detener point-fixes y diagnosticar raíz antes de otro cambio;
4. si falla un mecanismo compartido (timer, reveal, routing, media/fallback, 3D), revisar la familia/estados afectados, no solo el ejemplo reportado;
5. closeout independiente: `LEARNING_COMPLIANCE_PASS / FAIL / NOT_APPLICABLE`.

## Evidencia reproducible — proporcional pero obligatoria cuando el claim es material

### `LOCAL_TOOL_SUCCESS != PORTABLE_REPRODUCIBILITY`
Un script/auditoría que funciona solo por una ruta local, navegador concreto o configuración no documentada no es un gate portable. Si la validación es material, hacerla reproducible desde entorno limpio/CI o declarar `LOCAL_ONLY_EVIDENCE` y limitar el claim.

### `GENERATED_EVIDENCE != SOURCE_ASSET`
No llenar Git con capturas, dumps, renders intermedios o matrices que pueden regenerarse. Versionar generadores/tests/fixtures normativos/resumen compacto y guardar outputs regenerables grandes como artifacts cuando corresponda.

### `CLAIM_SCOPE <= VERIFIED_SCOPE`
No afirmar compatibilidad/UX/rendimiento para más dispositivos, viewports, estados de timer/reveal/routing/3D de los que realmente se han probado. Una muestra puede justificar un claim acotado, no uno total.

### `CURRENT_OBSERVED_STATES != CONTRACT_STATE_SPACE`
Que una ejecución actual no produzca uno de los estados válidos del juego no autoriza a eliminar ese estado del contrato. Cambiar estados válidos exige decisión explícita, no una conclusión accidental de una auditoría.

### Fallos del harness
Un fallo de browser/CDP/tooling/CI se clasifica como infraestructura; no demuestra por sí mismo que el producto haya fallado, pero tampoco permite marcar PASS. Mantener `FAIL / NOT_EXECUTED` hasta tener evidencia válida y diagnosticar sin rebajar el criterio de producto.

## Ejemplos Gymkana
- Timer/reveal: probar los estados que realmente se afirman, no solo el happy path inicial.
- Responsive: un viewport verde no certifica automáticamente los demás soportados.
- Media/3D: asset cargado no equivale a contenido útil/visible; revisar resultado renderizado cuando importe.
- Evidencia visual/3D regenerable: preferir artifacts sobre cientos de archivos derivados en el repo.

No añadir ceremonia a microfixes. El aprendizaje debe cambiar estrategia, estado adversarial probado, evidencia o decisión de escalado; citar la regla no basta.
