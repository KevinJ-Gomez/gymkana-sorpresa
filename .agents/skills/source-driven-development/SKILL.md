---
name: source-driven-development
description: Verifica APIs, frameworks, SDKs y comportamientos cambiantes contra documentación actual y versión real antes de implementar.
---
# Source-driven development

`CURRENT_OFFICIAL_DOCS + INSTALLED_VERSION > MODEL_MEMORY`.

1. Identifica versión real.
2. Lee docs/changelog oficiales; si hay docs locales versionadas (como Next), van primero.
3. Context7/equivalente solo si acelera documentación version-specific.
4. Distingue API documentada, comportamiento observado y workaround.
5. Implementa el menor cambio compatible.
6. Ejecuta compile/typecheck/test/query/request real.
7. Si docs/runtime contradicen, conserva evidencia y diagnostica.

Gate: `VERSION_KNOWN / OFFICIAL_SOURCE_CHECKED / IMPLEMENTED_AGAINST_REAL_VERSION / EXECUTED_VERIFICATION`.
