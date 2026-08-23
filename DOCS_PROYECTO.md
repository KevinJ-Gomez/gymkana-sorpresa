# Documentación Maestra — Gymkana Digital de Cumpleaños

> Este documento es la fuente de verdad narrativa y técnica del proyecto. Está pensado para que cualquier persona (o cualquier IA) pueda retomar el trabajo desde cero sin más contexto que este fichero + el código del repositorio.

---

## 1. Visión General

Este proyecto es una **gymkana híbrida de 11 días**, pensada como regalo de cumpleaños, que coincide con unas **vacaciones en pareja**. La mecánica combina dos mundos:

- **Mundo físico**: regalos reales (un bolso, maquillaje, flores, una excursión, pistas escondidas en la maleta) comprados de antemano.
- **Mundo digital**: esta web, que actúa de "calendario de adviento" — cada día del viaje se desbloquea una pantalla nueva con un acertijo, un minijuego o una contraseña que hay que conseguir hablando con amigos por WhatsApp.

### El problema que resuelve la web

Por **limitación de equipaje** (maletas de viaje, no se puede cargar con regalos físicos grandes de un lado a otro), los regalos reales **se quedan en casa** en vez de viajar con la pareja. La web es la solución narrativa a ese problema: en vez de entregar el regalo físico el día que "toca", la app **revela el regalo de forma virtual y humorística** (una foto graciosa/IA de la propia persona posando con el bolso, "maquillada" con IA, etc.) mientras dura el viaje, y el regalo físico real se entrega en mano **al volver a casa**.

Esto convierte una limitación logística (no poder llevar los regalos de viaje) en parte de la broma y de la sorpresa: cada día la pareja "gana" su regalo en la web mucho antes de poder tocarlo, generando expectación hasta la vuelta a casa.

### Tono

Romántico + humorístico + **cinematográfico**. La estética visual es una **nebulosa espacial rosa/magenta** con una constelación de estrellas navegable en 3D (ver [Dirección Visual](#3-dirección-visual-experiencia-inmersiva-3d)); el copy y las imágenes/vídeos (fotos posando de forma graciosa, mensajes cifrados, amigos grabándose vídeos de ánimo) son deliberadamente informales y cómplices. El contraste entre "envoltorio épico" y "contenido de broma" es intencionado.

### ⚠️ Restricción técnica principal: solo móvil (portrait)

La aplicación se consume **100% en móvil, en modo vertical (portrait)**. **No hay versión de escritorio** y no es un objetivo tenerla. Todas las decisiones de UI, 3D, rendimiento e interacción (taps y swipes, nunca hover ni teclado) se toman optimizando para pantalla de móvil en vertical. Cualquier trabajo futuro debe respetar esta restricción: si algo se ve bien en escritorio pero cuesta batería o legibilidad en móvil, gana el móvil.

---

## 2. Timeline de los 11 días

La gymkana dura **11 días**, del **2 al 12 de octubre**, coincidiendo con las vacaciones en pareja. `Día 1` de la app = **2 de octubre** (primer día del viaje); `Día 11` de la app = **12 de octubre** = **el cumpleaños** y cierre de la gymkana.

Estas son las **fechas reales y definitivas** (ya reflejadas en `unlockDate` dentro de `gymkanaConfig.ts`):

| Día | Fecha | Dinámica / acertijo | Premio o revelación |
|---|---|---|---|
| **1** | 2 oct | Sin contraseña. Mensaje de bienvenida: los regalos físicos se han quedado en casa por el equipaje, y hay que ganárselos aquí, día a día. | Texto de bienvenida — arranca la gymkana. |
| **2** | 3 oct | Acertijo sobre el primer viaje en pareja (adivinar el nombre de la ciudad). | Galería de fotos placeholder de aquel viaje (a sustituir por fotos reales). |
| **3** | 4 oct | Adivinar una canción a partir de una pista con emojis. | La canción sonando (reproductor de audio) + una carta de amor escrita. |
| **4** 🎁 *Maquillaje* | 5 oct | Sin acertijo "de lógica": hay que **pedir la clave a una amiga (Marta) por WhatsApp**, diciéndole la frase clave ("la clave del día 4"). | Se revela una **foto humorística/generada con IA** de la propia persona "maquillada", con el mensaje de que el maquillaje real ya la espera en casa. |
| **5** | 6 oct | Quiz interactivo de pareja (preguntas sobre la relación, sin fallos permitidos). | Vale digital canjeable por una cena a elección durante el viaje. |
| **6** | 7 oct | Puzzle/rompecabezas (ordenar piezas numeradas). | Pista sobre una excursión a hacer durante el viaje (mirador con forma de corazón). |
| **7** 🎁 *Flores* | 8 oct | Acertijo sobre la comida favorita de la pareja. | Animación de flores creciendo (CSS/Framer Motion) — las flores reales van de camino. |
| **8** | 9 oct | Mensaje cifrado al revés (hay que leerlo en espejo o pulsar "descifrar"). | Vídeo de un amigo dando ánimos de cumpleaños (placeholder de vídeo a sustituir). |
| **9** 🎁 *Bolso* | 10 oct | Pista con **audio distorsionado**: hay que **pedir la clave a un amigo (Dani) por WhatsApp** para poder entenderlo. | Se revela una **foto de la propia persona posando "en plan alta costura"** con el bolso (foto graciosa/editada con IA), como si ya fuera modelo profesional. El bolso real espera en casa. |
| **10** | 11 oct | Minijuego "encuentra el corazón" (entre estrellas, se mueve si fallas). | Pista física escondida de verdad en el equipaje/viaje (bolsillo delantero de la maleta pequeña). |
| **11** 🎂 | **12 oct** | **El cumpleaños.** Sin contraseña, se desbloquea solo al entrar. | Confeti (`canvas-confetti`) + muro interactivo con vídeos de amigos felicitando (Marta, Dani, Lucía, "Tus padres" — placeholders a sustituir por los vídeos reales). |

### Hilo narrativo de las contraseñas por WhatsApp

Dos días (4 y 9) dependen deliberadamente de **interacción social real**, no de lógica: la persona sorprendida tiene que escribir a un amigo/a concreto por WhatsApp y pedirle la clave con una frase concreta ("la clave del día 4"). Esto está pensado para que los amigos también formen parte de la broma (pueden hacerse de rogar, mandar pistas falsas, etc. — eso ya es fuera de la app). El nombre del amigo, la frase y la pista están en el campo `hintExtra` de cada día en `gymkanaConfig.ts`, así que son 100% editables sin tocar componentes.

---

## 3. Dirección Visual: experiencia inmersiva 3D

> **Pivote de diseño.** El proyecto arrancó con un grid 2D de 11 tarjetas tipo "calendario de adviento". Ese enfoque está **descartado**: se ha sustituido por una experiencia inmersiva 3D mobile-first. Este apartado documenta la dirección actual.

### El concepto

La gymkana ya no es una cuadrícula: es un **viaje por una nebulosa**. La persona navega por el espacio y cada día es una **estrella de una constelación** que tiene que alcanzar.

### Las tres fases narrativas

La app tiene tres estados visuales encadenados:

1. **La Presentación (cinemática de intro)** — Al abrir la web, antes de ver nada más, aparece una secuencia narrativa animada con Framer Motion. El texto explica que el viaje del **2 de octubre** acaba de empezar, que los regalos no cabían en la maleta, y que tendrá que ir resolviendo acertijos en esta nebulosa para descubrir qué le espera a la vuelta. Cierra con un botón grande de **"Comenzar Viaje"**. Ver [Secuencia de Intro](#31-secuencia-de-intro).
2. **La Nebulosa y la Constelación (menú principal)** — Un canvas de React Three Fiber a pantalla completa. De fondo, gas nebular generado con **ruido fractal (fBm) con domain warping** y un cielo de estrellas con centelleo, púas de difracción y estrellas fugaces. Encima, las **11 estrellas de los días dibujan un CORAZÓN**: se reparten por longitud de arco sobre la curva cardioide, y el **Día 11 (el cumpleaños) cae exactamente en la punta inferior**, de modo que al encenderlo la silueta queda cerrada. Hay **dos modos de cámara**: *viaje* (de cerca, recorriendo estrella a estrella) y *mapa* (alejada, con el corazón entero en pantalla), que se alternan con un botón o pellizcando. Estados de cada estrella:
   - **Bloqueada**: gris oscuro/translúcida, latiendo despacio.
   - **Completada**: brillo dorado.
   - **Hoy**: resplandor rosa/blanco intenso — es la que llama a que la toques.
3. **La Transición (zoom in) y la tarjeta** — Al tocar la esfera del día actual, la cámara hace un **zoom inmersivo y rápido** hacia esa esfera (lerp de cámara en `useFrame`). Cuando llega, se despliega **por encima del canvas** una tarjeta HTML glassmorphism (Framer Motion) con el acertijo del día: **grande**, textos muy legibles, cristal esmerilado con bordes brillantes. Un botón de **"Volver a la nebulosa"** hace el **zoom out inverso** de la cámara.

### 3.1. Secuencia de Intro

Existe una pantalla inicial de presentación narrativa (`IntroSequence.tsx`) que se muestra **una sola vez por dispositivo**: una vez completada, queda registrada en `localStorage` para no repetirse en cada recarga y que la persona entre directa a la nebulosa. Se puede volver a ver borrando el almacenamiento del navegador o desde el Modo Testing.

### Paleta

| Rol | Color aproximado |
|---|---|
| Fondo profundo | `#0b0620` (violeta casi negro) |
| Nebulosa base | magenta / fucsia `#d946ef`, rosa `#fb7185` |
| Nebulosa secundaria | violeta vivo `#a855f7`, índigo `#6366f1` |
| Destellos | dorado `#fbbf24` |
| Esfera "hoy" | rosa/blanco incandescente |
| Esfera completada | dorado |
| Esfera bloqueada | gris translúcido |

### Reglas de rendimiento (móvil)

Son requisitos, no sugerencias — la app corre en el móvil de otra persona y no puede quemarle la batería:

- `dpr={[1, 2]}` en el `<Canvas>` (nunca dpr libre: en móviles de 3x arruina el rendimiento).
- Antialias desactivado; el "glow" se consigue con materiales emisivos + halos aditivos, **no** con post-procesado (bloom es demasiado caro en móvil).
- Recuento de partículas contenido y geometrías de baja resolución en las esferas.
- Sin `hover`: toda la interacción es **tap y swipe**.

---

## 4. Arquitectura Técnica

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
- **3D**: `three` + `@react-three/fiber` + `@react-three/drei` (nebulosa, constelación, cámara).
- **Animación 2D/UI**: Framer Motion (intro cinemática, aparición de la tarjeta, shake al fallar contraseña).
- **Confeti**: `canvas-confetti`, solo en el Día 11.
- **Iconografía**: `lucide-react`.
- **Seguridad de contraseñas**: SHA-256 en cliente vía Web Crypto (`crypto.subtle`), sin dependencias externas. No hay backend: es disuasión de "view-source" casual, no un secreto de alto valor.
- **Persistencia**: `localStorage` (vía `useSyncExternalStore`) para tres cosas — qué días ya se han resuelto, si el Modo Testing está activo, y si la intro ya se ha visto.
- **Todo es cliente**: no hay Server Components con lógica de negocio; toda la app es interactiva y vive en el navegador (SPA de facto dentro del App Router).

### Sistema modular de días

La pieza de diseño central es que **cada día es un componente aislado e intercambiable**:

```
src/
  config/gymkanaConfig.ts   ← única fuente de verdad: fechas, textos, hashes, assets
  types/gymkana.ts           ← tipos (DayConfig, DayComponentProps...)
  lib/
    hash.ts                   ← SHA-256 en cliente
    dates.ts                   ← ¿ha llegado ya la fecha de desbloqueo?
    storage.ts                  ← progreso + modo testing + intro vista (localStorage)
    constellation.ts             ← posiciones 3D de las 11 esferas (zigzag vertical)
    random.ts                     ← PRNG determinista que genera la nebulosa
  components/
    GymkanaApp.tsx              ← orquestador de las 3 fases: intro → nebulosa → día
    IntroSequence.tsx            ← cinemática narrativa de entrada
    DayContainer.tsx              ← tarjeta glassmorphism + gate de contraseña
    three/
      NebulaScene.tsx               ← Canvas R3F: partículas, constelación, cámara
    ui/
      GiftImageReveal.tsx           ← imagen con fallback si el fichero no existe
    days/
      Day1.tsx … Day11.tsx            ← un componente por día (el "premio"/reto)
      index.ts                         ← registro id → componente
```

> **Nota histórica**: `DayGrid.tsx`, `DayCard.tsx` y `GlassCard.tsx` (el grid 2D original y su panel de cristal) se **eliminaron** en el pivote a 3D. Si se busca ese código, está en el historial de git antes del commit del rediseño.

**Flujo de un día:**

1. `GymkanaApp` decide qué fase mostrar (intro / nebulosa / día enfocado).
2. `DayContainer` (genérico) mira `requiresPassword` en la config del día:
   - Si `true`: pinta el riddle + input de contraseña, calcula el SHA-256 del texto introducido y lo compara con la lista de `passwordHashes` válidos del día. Si falla → shake + mensaje de error. Si acierta → llama a `onUnlock()`.
   - Si `false`: el componente `Day{n}` implementa su propio reto interno (quiz, puzzle, minijuego, mensaje al revés) y llama a `onUnlock()` cuando el usuario lo supera.
   - En ambos casos el componente `Day{n}` se renderiza **siempre**, también junto al gate de contraseña: hay días cuyo enunciado vive dentro del componente (el Día 3 muestra los emojis de la canción) y sin él la clave sería inadivinable. Los días que no tienen nada que enseñar antes de desbloquear devuelven `null`.
3. Una vez `isUnlocked` es `true`, el componente `Day{n}` pinta el premio/revelación (imagen, galería, audio+carta, confeti, etc.).

Añadir un día nuevo (o rehacer uno) = crear `Day{n}.tsx` con la firma `{ config, isUnlocked, onUnlock }`, registrarlo en `days/index.ts`, y rellenar su entrada en `gymkanaConfig.ts`. No hace falta tocar `DayContainer` ni el resto de la app.

---

## 5. Guía de Configuración (paso a paso)

Todo el contenido editable vive en **`src/config/gymkanaConfig.ts`**. Es un array `gymkanaConfig: DayConfig[]` con un objeto por día. Los campos disponibles (no todos los días usan todos) están documentados uno a uno en `src/types/gymkana.ts`.

### 5.1. Cambiar las fechas

Cada día tiene un campo `unlockDate` en formato `"YYYY-MM-DD"`:

```ts
{
  id: 1,
  unlockDate: "2026-10-02",   // ← Día 1 = 2 de octubre
  ...
}
```

Un día se vuelve alcanzable en la constelación en cuanto la fecha local del dispositivo alcanza `unlockDate` (comparación por `src/lib/dates.ts`).

**Las fechas ya están puestas y son las definitivas**: `2026-10-02` (Día 1) … `2026-10-12` (Día 11, el cumpleaños). Solo hay que tocarlas si el viaje cambia de fechas — en ese caso, mantener siempre 11 días consecutivos y que el `id: 11` caiga exactamente en el cumpleaños.

### 5.2. Cambiar acertijos, pistas y textos

Todos los textos visibles (`riddle`, `hintExtra`, `rewardTitle`, `rewardDescription`, textos de quiz, mensaje cifrado, etc.) son strings normales dentro del objeto de cada día. Se editan directamente ahí, sin tocar ningún componente.

### 5.3. Generar una contraseña nueva (¡el paso importante!)

Las contraseñas **nunca se escriben en texto plano** en el config — se guarda el hash SHA-256 de la respuesta **normalizada**, y el navegador aplica esa misma normalización a lo que escribe la persona antes de comparar.

**Normalización (clave para la UX).** La entrada se pasa a minúsculas, se le quitan las tildes y se colapsan los espacios de sobra. `"  Móvil "`, `"MÓVIL"` y `"movil"` valen exactamente igual: acertar el acertijo basta, sin pelearse con el teclado del móvil. Nota: al quitar diacríticos la `ñ` se convierte en `n`, así que `"niña"` y `"nina"` también son equivalentes — es intencionado, en una gymkana interesa ser generoso.

La función vive en `src/lib/hash.ts` (`normalizePassword`) y está **duplicada a propósito** en `scripts/generate-hash.mjs`, porque el script es Node plano y no puede importar TypeScript. Si cambias una, cambia la otra o los hashes dejarán de validar.

**Varias respuestas por día.** El campo es `passwordHashes: string[]`, no un único hash: un mismo acertijo puede tener varias soluciones buenas y basta con acertar una. El Día 1, por ejemplo, acepta `"movil"` e `"iphone"`.

**Paso a paso:**

1. Piensa la respuesta (o varias), por ejemplo `"movil"` e `"iphone"`.
2. Desde la raíz del proyecto, ejecuta:
   ```bash
   node scripts/generate-hash.mjs "movil" "iphone"
   ```
   Cada argumento es una respuesta válida para **el mismo día**.
3. El script imprime el bloque ya formateado:
   ```
   passwordHashes: [
     "8dd3d0f12d706756295575bfc283da9e4ef2658cbb8531aa7261b8aed27518e5",
     "241c1e30ed886aa4a8f4248024be2ca1a221fe9773b52e2dca7891ff5771f399",
   ],
   ```
4. Pégalo en el día correspondiente de `gymkanaConfig.ts`:
   ```ts
   {
     id: 1,
     requiresPassword: true,
     passwordHashes: [
       "8dd3d0f12d706756295575bfc283da9e4ef2658cbb8531aa7261b8aed27518e5",
       "241c1e30ed886aa4a8f4248024be2ca1a221fe9773b52e2dca7891ff5771f399",
     ],
     passwordPlaceholder: "¿Qué es?",
     ...
   }
   ```
5. Guarda y prueba en local que las variantes (`"movil"`, `"Móvil"`, `"  MÓVIL  "`, `"iPhone"`) desbloquean el día.

**Contraseñas placeholder actuales** (a sustituir por las reales antes de lanzar):

| Día | Contraseña placeholder |
|---|---|
| 1 | `movil` o `iphone` (definitivas, ya configuradas) |
| 2 | `valencia` |
| 3 | `perfect` |
| 4 | `carmin` |
| 7 | `sushi` |
| 9 | `gucci` |

---

## 6. Gestión de Assets

Los ficheros van dentro de `/public` y se referencian en `gymkanaConfig.ts` con la ruta empezando por `/`. Si un fichero no existe todavía, la app **no se rompe**: las imágenes muestran un placeholder elegante indicando dónde colocarlas, y los reproductores de audio/vídeo simplemente no suenan/reproducen.

| Fichero | Día | Campo en config | Descripción |
|---|---|---|---|
| `public/makeup-funny.jpg` | 4 | `imageSrc` | Foto humorística/IA de la persona "maquillada". Formato cuadrado recomendado. |
| `public/bag-funny.jpg` | 9 | `imageSrc` | Foto de la persona posando "alta costura" con el bolso. Formato cuadrado recomendado. |
| `public/audio/day3-song.mp3` | 3 | `songFile` | Canción a reproducir tras adivinar el emoji-clue. |
| `public/audio/day9-distorted.mp3` | 9 | `audioHintSrc` | Audio distorsionado que da la pista para pedir la clave a Dani. |
| `public/videos/day8-animo.mp4` | 8 | `videoSrc` | Vídeo de un amigo dando ánimos de cumpleaños. |
| `public/videos/<nombre>.mp4` | 11 | `friendVideos[].videoSrc` | Un vídeo por cada amigo del muro final. Hay que añadir la ruta manualmente en el array `friendVideos` de `gymkanaConfig.ts` (por defecto Marta, Dani, Lucía y "Tus padres" están definidos sin `videoSrc`, es decir, en modo placeholder). |

Hay sendos `README.md` recordatorio dentro de `public/audio/` y `public/videos/` con esta misma lista.

---

## 7. Modo Testing

Permite navegar los 11 días **sin esperar a que llegue la fecha real**, para poder probar toda la gymkana de principio a fin antes de regalarla.

**Dos formas de activarlo:**

1. **Gesto oculto en la propia web**: tocar 5 veces seguidas (en menos de 2 segundos) el título de la cabecera sobre la nebulosa. Se activa un badge "🧪 Modo Testing activo", todas las esferas de la constelación quedan alcanzables independientemente de su `unlockDate`, y aparece un atajo para **volver a ver la intro**. El estado se guarda en `localStorage`, así que persiste entre recargas hasta que se vuelva a tocar 5 veces para desactivarlo.
2. **Variable de entorno**: en `.env.local` (copiar desde `.env.local.example`):
   ```
   NEXT_PUBLIC_TESTING_MODE=true
   ```
   Con esto el Modo Testing arranca activado por defecto en ese entorno.

### Probar desde el ordenador

La gymkana sigue siendo **solo móvil**: no existe una versión de escritorio "adaptada", ni se va a hacer. Pero para poder probarla cómodamente desde el ordenador, al abrir la web en una pantalla grande (`min-width: 1024px` + ratón) aparece una **vista previa de escritorio**: la app real montada dentro de un iframe con el tamaño exacto de un móvil (iPhone SE / iPhone 14 / Pixel 7, seleccionable).

Esto es importante: **no es una adaptación ni una segunda implementación**. Dentro del iframe el viewport mide de verdad 390×844, así que las media queries, `100dvh`, los safe-area insets y el 3D se comportan igual que en un teléfono. Lo que se ve en el ordenador es la versión móvil, píxel por píxel.

- Se arrastra **con el ratón** dentro del móvil igual que se haría con el dedo.
- El botón *Abrir a pantalla completa* abre `/?embed=1` en una pestaña nueva: ese parámetro salta la vista previa y pinta la app directamente ocupando toda la ventana.
- El progreso y el Modo Testing se guardan en `localStorage` del navegador, compartidos entre la vista previa y la pestaña a pantalla completa (mismo origen).

Ficheros: `src/components/AppShell.tsx` (decide móvil vs. escritorio) y `src/components/desktop/DesktopFrame.tsx` (el marco). Ninguno de los dos toca la app móvil.

⚠️ **Antes de desplegar la versión real** que verá la persona sorprendida: asegurarse de que `NEXT_PUBLIC_TESTING_MODE` sea `false` (o no exista) en el entorno de producción, y de no dejar el Modo Testing activado (vía el gesto oculto) en el navegador/dispositivo que ella vaya a usar.

---

## 8. Estado actual y pendientes

Esto resume qué está terminado y qué queda por hacer para que la gymkana esté lista para regalarse de verdad. Útil como lista de control al retomar el proyecto.

**Hecho:**
- App completa y funcional: los 11 días son jugables de principio a fin (no hay stubs vacíos).
- Arquitectura modular verificada (build, typecheck y lint en verde).
- Flujo completo probado en navegador: bloqueo por fecha, Modo Testing, gate de contraseña (fallo con shake + acierto), Día 4 con fallback de imagen, Día 11 con confeti y muro de vídeos.
- **Fechas reales puestas**: 2–12 de octubre de 2026.
- **Pivote visual a experiencia 3D** (nebulosa + constelación + intro cinemática), mobile-first portrait.
- Repositorio en GitHub (`origin/main`) al día.

**Pendiente antes de regalar la gymkana:**
- Sustituir las contraseñas placeholder que quedan (`valencia`, `perfect`, `carmin`, `sushi`, `gucci`) por las reales, generando los hashes con `scripts/generate-hash.mjs`. El Día 1 ya tiene las suyas definitivas.
- Coordinar con Marta y Dani las claves reales de los Días 4 y 9 (y avisarles de qué frase van a recibir por WhatsApp).
- Producir/editar las fotos reales: `makeup-funny.jpg` (Día 4) y `bag-funny.jpg` (Día 9) — fotos humorísticas o generadas/retocadas con IA de la persona posando.
- Grabar y subir los vídeos: el de ánimo del Día 8 y los vídeos de los amigos del muro del Día 11 (Marta, Dani, Lucía, padres...), actualizando `friendVideos` en el config con sus `videoSrc`.
- Subir la canción del Día 3 (`day3-song.mp3`) y grabar/generar el audio distorsionado del Día 9 (`day9-distorted.mp3`).
- Revisar/editar los textos de acertijos, pistas y quiz para que reflejen recuerdos y bromas reales de la pareja (actualmente son placeholders razonables pero genéricos).
- Antes del día del regalo: desactivar `NEXT_PUBLIC_TESTING_MODE` y comprobar que no queda activado por el gesto oculto en el dispositivo real.
- Desplegar (Vercel u otra plataforma compatible con Next.js) y compartir el enlace.
