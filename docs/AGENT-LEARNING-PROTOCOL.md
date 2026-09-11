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

No añadir ceremonia a microfixes. El aprendizaje debe cambiar estrategia, estado adversarial probado, evidencia o decisión de escalado; citar la regla no basta.
