# Auditoría Final, Freeze y Plan de Entrega — Gymkana Digital (Issue #6)

**Fecha:** 2026-09-06  
**Rama:** `audit/issue-6-release`  
**Objetivo:** Inventario funcional exhaustivo, detección de defectos en navegador real (móvil y escritorio), auditoría de seguridad/privacidad/spoilers y rendimiento WebGL/móvil para declarar el *freeze* de release de la Gymkana.

---

## 1. Resumen Ejecutivo del Estado del Proyecto

| Vector Auditado | Veredicto | Hallazgos Destacados |
| :--- | :---: | :--- |
| **Seguridad & Release Gate** | **`BLOCKED`** | Ruta oculta pública `/spoiler` con respuestas hardcodeadas, 117 fotos raw en `fotos_originales/` no ignoradas por `.gitignore`, y gesto secreto en `LockedScreen` fácilmente activable por accidente. |
| **Visual & Móvil** | **`REQUIRES FIX`** | Tapping 3D en estrellas roto por `visible={false}`, `drag="y"` en `DayContainer` saboteando el scroll de la tarjeta, y falta de captura de botón Atrás (`popstate`). |
| **Rendimiento & WebGL** | **`REQUIRES FIX`** | Saturación de memoria en móvil por 31 fotos en `PostureoMosaic.tsx`, listeners táctiles a 120Hz sin throttle en `TouchParticleTrail.tsx`, y `getImageData` síncrono en cada evento de rascado en `ScratchPhotoCard.tsx`. |
| **Inventario Funcional** | **`REQUIRES FIX`** | Día 6 desincronizado (mantiene minijuego numérico 1..6 que salta la clave de Marta por WhatsApp y no muestra la foto/recompensa del maquillaje). |
| **Build & Tipos** | **`APROBADO`** | `tsc --noEmit`, `next build` y `npm audit` pasan limpiamente; 15 advertencias menores de variables no usadas en linter. |

---

## 2. Clasificación de Hallazgos por Severidad

### 🔴 Defectos Critical (P0)

1. **[CRIT-01] Raycast táctil sobre las estrellas 3D 100% deshabilitado (`DayStar.tsx`)**
   - **Ubicación:** `src/components/three/DayStar.tsx:L159-L167`
   - **Causa:** El `<mesh visible={false}>` usado para la zona de toque invisible desactiva internamente el `raycast` en Three.js / React Three Fiber (`if (!mesh.visible) return;`).
   - **Impacto:** Tocar directamente las estrellas en la nebulosa no abre su día correspondiente; la única vía de acceso es la tarjeta inferior del HUD.
   - **Corrección:** Usar `<meshBasicMaterial transparent opacity={0} depthWrite={false} />` en lugar de `visible={false}`.

2. **[CRIT-02] Conflicto de gestos: `drag="y"` en `DayContainer` bloquea y cierra el scroll del contenido**
   - **Ubicación:** `src/components/DayContainer.tsx:L66-L72`
   - **Causa:** El contenedor raíz tiene `drag="y"` sin aislar `dragListener={false}`.
   - **Impacto:** Al deslizar verticalmente para leer el texto o fotos (Día 1, Día 2, Día 5, Día 7, Día 8), se dispara el cierre accidental (`onClose`) de la tarjeta.
   - **Corrección:** Utilizar `useDragControls()` con `dragListener={false}` y restringir el inicio del arrastre únicamente al asa superior (`dragControls.start(e)`).

3. **[CRIT-03] Ruta oculta `/spoiler` y exposición directa de la imagen del bolso**
   - **Ubicación:** `src/app/spoiler/page.tsx`, `src/components/spoiler/SpoilerExperience.tsx`, `public/images/spoiler-original.jpg`.
   - **Impacto:** Permite ver antes de fecha el bolso Michael Kors con respuestas en texto plano en el cliente y assets públicos directos.
   - **Corrección:** Eliminar la ruta `/spoiler`, su componente huérfano y retirar la imagen no procesada.

4. **[CRIT-04] Directorio `fotos_originales/` no ignorado en `.gitignore`**
   - **Ubicación:** `.gitignore`, carpeta `fotos_originales/`.
   - **Impacto:** 117 fotografías raw personales (incluyendo subcarpeta sensible `4_intimas/`) con riesgo de filtración de metadatos GPS/EXIF en Git.
   - **Corrección:** Añadir `/fotos_originales/` a `.gitignore` y des-trackear mediante `git rm -r --cached fotos_originales/`.

5. **[CRIT-05] Bypass involuntario de la pantalla de bloqueo (`LockedScreen.tsx`)**
   - **Ubicación:** `src/components/LockedScreen.tsx:L61`, `src/components/GymkanaApp.tsx:L91-L105`
   - **Impacto:** 5 toques en la palabra "Bloqueada" activan y guardan permanentemente `gymkana:testing-mode="true"` en `localStorage`, desbloqueando toda la gymkana antes del 2 de octubre.
   - **Corrección:** Desactivar el botón interactivo de toques rápidos en la pantalla bloqueada en producción.

---

### 🟠 Defectos High (P1)

6. **[HIGH-01] Incoherencia y bypass de contraseña en Día 6 (`Day6.tsx`)**
   - **Ubicación:** `src/components/days/Day6.tsx:L42-L52`
   - **Causa:** Mantiene un puzzle 1..6 obsoleto que llama directamente a `onUnlock()`, ignorando la contraseña de Marta por WhatsApp configurada en `gymkanaConfig.ts`, y no renderiza `/images/makeup-funny.jpg`.
   - **Corrección:** Eliminar el puzzle desincronizado, delegar el reto de contraseña a `DayContainer`, y renderizar la recompensa con `GiftImageReveal`.

7. **[HIGH-02] Jank severo y saturación del hilo principal en `TouchParticleTrail.tsx`**
   - **Ubicación:** `src/components/effects/TouchParticleTrail.tsx:L20-L77`
   - **Causa:** `touchmove`/`pointermove` sin throttle a 120Hz actualizando estado React con `setParticles` y renderizando divs con blur/boxShadow.
   - **Corrección:** Estrangular la generación de partículas (máximo una cada 50 ms) y optimizar su ciclo de vida.

8. **[HIGH-03] GPU Pipeline Stalls síncronos por `getImageData` en rascado (`ScratchPhotoCard.tsx`)**
   - **Ubicación:** `src/components/effects/ScratchPhotoCard.tsx:L87-L112`
   - **Causa:** Invocación de `getImageData` en cada píxel arrastrado al rascar.
   - **Corrección:** Estrangular la comprobación a intervalos de ~200 ms o al soltar el dedo (`pointerup`).

9. **[HIGH-04] Bucle 3D Three.js a 60 FPS sin pausar bajo modales opacos (`NebulaScene.tsx`)**
   - **Ubicación:** `src/components/three/NebulaScene.tsx:L360`
   - **Causa:** `Canvas` con `frameloop="always"` por defecto ejecutando 21 hooks `useFrame` con la tarjeta de día abierta al 92% de la pantalla.
   - **Corrección:** Configurar `frameloop={focusedDayId ? "never" : "always"}`.

10. **[HIGH-05] Auto-zoom en iOS Safari en inputs de texto (`Day8.tsx`)**
    - **Ubicación:** `src/components/days/Day8.tsx:L346, L426, L505`
    - **Causa:** Inputs con tamaño de fuente < 16px provocan zoom forzado en Safari móvil.
    - **Corrección:** Fijar `style={{ fontSize: 16 }}` o clase `text-base`.

11. **[HIGH-06] Fallback de `ScratchPhotoCard.tsx` tapando la imagen real cargada**
    - **Ubicación:** `src/components/effects/ScratchPhotoCard.tsx:L142-L146`
    - **Causa:** El div de fallback de reserva se posicionaba con `absolute inset-0` y opacidad sobre la etiqueta `<img>` cargada con éxito.
    - **Corrección:** Condicionar la visualización del fallback exclusivamente a que ocurra un error de carga (`imageError`).

---

### 🟡 Defectos Medium / Calidad de Uso Real (P2)

12. **[MED-01] Navegación móvil con botón "Atrás"**
    - Sincronizar el estado de apertura de tarjetas mediante `popstate` / `history.pushState` para que al pulsar Atrás en el móvil se cierre la vista activa en lugar de expulsar de la web.
13. **[MED-02] Toques en `NebulaScene` activos con el cajón de planning abierto**
    - Desactivar gestos de rotación 3D del fondo mientras el cajón del calendario esté desplegado.
14. **[MED-03] Capa de aviso horizontal con `pointer-events-none` (`GymkanaApp.tsx`)**
    - Cambiar a `pointer-events-auto` para evitar que toques a ciegas interactúen con la escena en orientación horizontal.
15. **[MED-04] Botón "Probar reto" expuesto a usuarios finales (`DayContainer.tsx`)**
    - Condicionar el botón y el candado de re-bloqueo a que `testingMode` esté activo.
16. **[MED-05] Carga de memoria en mosaico de postureos (`PostureoMosaic.tsx`)**
    - Cambiar `loading="eager"` a `loading="lazy"` en las 31 imágenes de la cuadrícula secundaria.
17. **[MED-06] Limpieza de advertencias de ESLint**
    - Limpiar 15 variables huérfanas en `Day3.tsx`, `Day7.tsx` y `Day8.tsx`.
18. **[MED-07] Erratas ortográficas en textos narrativos**
    - Corregir textos en `IntroSequence.tsx` y `Day4.tsx`.

---

## 3. Orden Recomendado de Implementación

1. **Fase 1 — Seguridad e Higiene Git**:
   - Actualizar `.gitignore` y des-trackear `fotos_originales/`.
   - Eliminar ruta `/spoiler` y componentes asociados.
   - Desactivar el bypass de toques rápidos en `LockedScreen.tsx`.
2. **Fase 2 — Interacción Táctil y Correcciones Funcionales**:
   - Reparar raycast en `DayStar.tsx` (estrellas 3D interactivas).
   - Aislar el drag en `DayContainer.tsx` con `useDragControls()`.
   - Corregir `Day6.tsx` (clave de Marta + imagen de maquillaje).
   - Añadir control de historial con `popstate` en `GymkanaApp.tsx`.
3. **Fase 3 — Rendimiento y Estabilidad Móvil**:
   - Throttle en `TouchParticleTrail.tsx` y `ScratchPhotoCard.tsx`.
   - Pausa de WebGL `frameloop` en `NebulaScene.tsx`.
   - `fontSize: 16px` en inputs de `Day8.tsx` y corrección de fallback en `ScratchPhotoCard.tsx`.
   - `loading="lazy"` en `PostureoMosaic.tsx` y `pointer-events-auto` en overlay landscape.
4. **Fase 4 — Limpieza y Validación**:
   - Limpieza de warnings de ESLint y erratas ortográficas.
   - Batería obligatoria de tests y validación visual en navegador.
   - Auditoría final con `security-reviewer` para certificar estado `READY`.

---

## 4. Pruebas Requeridas para Declarar la Gymkana Terminada

1. `npm ci` (instalación limpia y reproducible).
2. `npm audit --omit=dev --audit-level=high` (0 vulnerabilidades en producción).
3. `npm run lint` (0 errores, 0 warnings).
4. `npx tsc --noEmit` (0 errores de TypeScript).
5. `npm run build` (compilación estática completa sin fallos).
6. Validación visual en navegador real (móvil y escritorio):
   - Toque de estrellas 3D en la constelación.
   - Scroll suave en tarjetas de día sin cierres involuntarios.
   - Flujo de retroceso con botón Atrás.
   - Rendimiento fluido de animaciones, rascado y galería.
7. Subagente `security-reviewer` final con veredicto **`READY`**.
