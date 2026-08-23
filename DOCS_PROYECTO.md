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

Romántico + humorístico. La estética visual (glassmorphism, degradados suaves, dark mode por defecto) es "elegante y de pareja"; el copy y las imágenes/vídeos (fotos posando de forma graciosa, mensajes cifrados, amigos grabándose vídeos de ánimo) son deliberadamente informales y cómplices.

---

## 2. Timeline de los 11 días

La gymkana tiene **11 días**, numerados internamente `Día 1` … `Día 11` en el código (`id` en `gymkanaConfig.ts`), pensados para coincidir con el rango del **2 al 12** del mes de las vacaciones (`Día 1` de la app = día 2 del calendario real → primer día completo de vacaciones; `Día 11` de la app = día 12 del calendario real → **el cumpleaños**, día del regreso o cierre del viaje).

> ⚠️ **Nota de estado**: a fecha de esta documentación, `gymkanaConfig.ts` todavía usa fechas placeholder (`2026-09-01` a `2026-09-11`, es decir 1–11, no 2–12). Antes de lanzar la gymkana real hay que actualizar las 11 `unlockDate` para que empiecen el día 2 y terminen el día 12 del mes real del viaje. Ver la sección [Guía de Configuración](#4-guía-de-configuración-paso-a-paso).

| Día | Dinámica / acertijo | Premio o revelación |
|---|---|---|
| **1** | Sin contraseña. Mensaje de bienvenida: los regalos físicos se han quedado en casa por el equipaje, y hay que ganárselos aquí, día a día. | Texto de bienvenida — arranca la gymkana. |
| **2** | Acertijo sobre el primer viaje en pareja (adivinar el nombre de la ciudad). | Galería de fotos placeholder de aquel viaje (a sustituir por fotos reales). |
| **3** | Adivinar una canción a partir de una pista con emojis. | La canción sonando (reproductor de audio) + una carta de amor escrita. |
| **4** 🎁 *Maquillaje* | Sin acertijo "de lógica": hay que **pedir la clave a una amiga (Marta) por WhatsApp**, diciéndole la frase clave ("la clave del día 4"). | Se revela una **foto humorística/generada con IA** de la propia persona "maquillada", con el mensaje de que el maquillaje real ya la espera en casa. |
| **5** | Quiz interactivo de pareja (preguntas sobre la relación, sin fallos permitidos). | Vale digital canjeable por una cena a elección durante el viaje. |
| **6** | Puzzle/rompecabezas (ordenar piezas numeradas). | Pista sobre una excursión a hacer durante el viaje (mirador con forma de corazón). |
| **7** 🎁 *Flores* | Acertijo sobre la comida favorita de la pareja. | Animación de flores creciendo (CSS/Framer Motion) — las flores reales van de camino. |
| **8** | Mensaje cifrado al revés (hay que leerlo en espejo o pulsar "descifrar"). | Vídeo de un amigo dando ánimos de cumpleaños (placeholder de vídeo a sustituir). |
| **9** 🎁 *Bolso* | Pista con **audio distorsionado**: hay que **pedir la clave a un amigo (Dani) por WhatsApp** para poder entenderlo. | Se revela una **foto de la propia persona posando "en plan alta costura"** con el bolso (foto graciosa/editada con IA), como si ya fuera modelo profesional. El bolso real espera en casa. |
| **10** | Minijuego "encuentra el corazón" (entre estrellas, se mueve si fallas). | Pista física escondida de verdad en el equipaje/viaje (bolsillo delantero de la maleta pequeña). |
| **11** 🎂 | El cumpleaños. Sin contraseña, se desbloquea solo al entrar. | Confeti (`canvas-confetti`) + muro interactivo con vídeos de amigos felicitando (Marta, Dani, Lucía, "Tus padres" — placeholders a sustituir por los vídeos reales). |

### Hilo narrativo de las contraseñas por WhatsApp

Dos días (4 y 9) dependen deliberadamente de **interacción social real**, no de lógica: la persona sorprendida tiene que escribir a un amigo/a concreto por WhatsApp y pedirle la clave con una frase concreta ("la clave del día 4"). Esto está pensado para que los amigos también formen parte de la broma (pueden hacerse de rogar, mandar pistas falsas, etc. — eso ya es fuera de la app). El nombre del amigo, la frase y la pista están en el campo `hintExtra` de cada día en `gymkanaConfig.ts`, así que son 100% editables sin tocar componentes.

---

## 3. Arquitectura Técnica

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
- **Animación**: Framer Motion (transiciones grid ↔ detalle, shake al fallar contraseña, animación de desbloqueo, entradas escalonadas de tarjetas).
- **Confeti**: `canvas-confetti`, solo en el Día 11.
- **Iconografía**: `lucide-react`.
- **Seguridad de contraseñas**: SHA-256 en cliente vía Web Crypto (`crypto.subtle`), sin dependencias externas. No hay backend: es disuasión de "view-source" casual, no un secreto de alto valor.
- **Persistencia**: `localStorage` (vía `useSyncExternalStore`) para dos cosas — qué días ya se han resuelto (para no repetir un acertijo tras refrescar) y si el Modo Testing está activo.
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
    storage.ts                  ← progreso + modo testing (localStorage)
  components/
    GymkanaApp.tsx              ← orquestador: alterna grid ⇄ detalle de día
    DayGrid.tsx / DayCard.tsx    ← el grid de 11 "candados"
    DayContainer.tsx              ← componente GENÉRICO: gate de contraseña
    ui/
      GlassCard.tsx                 ← panel glassmorphism reutilizable
      GiftImageReveal.tsx            ← imagen con fallback si el fichero no existe
    days/
      Day1.tsx … Day11.tsx            ← un componente por día (el "premio"/reto)
      index.ts                         ← registro id → componente
```

**Flujo de un día:**

1. `GymkanaApp` decide si mostrar el grid o el detalle de un día concreto.
2. `DayContainer` (genérico) mira `requiresPassword` en la config del día:
   - Si `true`: pinta el riddle + input de contraseña, calcula el SHA-256 del texto introducido y lo compara con `passwordHash`. Si falla → shake + mensaje de error. Si acierta → llama a `onUnlock()`.
   - Si `false`: delega directamente en el componente `Day{n}` correspondiente, que implementa su propio reto interno (quiz, puzzle, minijuego, mensaje al revés) y llama a `onUnlock()` cuando el usuario lo supera.
3. Una vez `isUnlocked` es `true`, el componente `Day{n}` pinta el premio/revelación (imagen, galería, audio+carta, confeti, etc.).

Añadir un día nuevo (o rehacer uno) = crear `Day{n}.tsx` con la firma `{ config, isUnlocked, onUnlock }`, registrarlo en `days/index.ts`, y rellenar su entrada en `gymkanaConfig.ts`. No hace falta tocar `DayContainer` ni el resto de la app.

---

## 4. Guía de Configuración (paso a paso)

Todo el contenido editable vive en **`src/config/gymkanaConfig.ts`**. Es un array `gymkanaConfig: DayConfig[]` con un objeto por día. Los campos disponibles (no todos los días usan todos) están documentados uno a uno en `src/types/gymkana.ts`.

### 4.1. Cambiar las fechas

Cada día tiene un campo `unlockDate` en formato `"YYYY-MM-DD"`:

```ts
{
  id: 1,
  unlockDate: "2026-09-01",   // ← cambiar por la fecha real
  ...
}
```

Un día se vuelve jugable en el grid en cuanto la fecha local del dispositivo alcanza `unlockDate` (comparación por `src/lib/dates.ts`). Para la gymkana real, las 11 fechas deben cubrir el rango real de vacaciones (día 2 → día 12 del mes correspondiente), con el `id: 11` cayendo exactamente en el día del cumpleaños.

### 4.2. Cambiar acertijos, pistas y textos

Todos los textos visibles (`riddle`, `hintExtra`, `rewardTitle`, `rewardDescription`, textos de quiz, mensaje cifrado, etc.) son strings normales dentro del objeto de cada día. Se editan directamente ahí, sin tocar ningún componente.

### 4.3. Generar una contraseña nueva (¡el paso importante!)

Las contraseñas **nunca se escriben en texto plano** en el config — se guarda el hash SHA-256 de la contraseña normalizada (minúsculas + sin espacios al principio/final), y el navegador compara ese mismo hash contra lo que la persona escribe.

**Paso a paso:**

1. Piensa la contraseña en texto plano, por ejemplo `"Valencia"`.
2. Desde la raíz del proyecto, ejecuta:
   ```bash
   node scripts/generate-hash.mjs "Valencia"
   ```
3. El script imprime algo así:
   ```
   Contraseña normalizada: "valencia"
   passwordHash: "626b208a365327e7ecd6ad5af2f39c8d08c2ad85a264bd0006450c4d034ba740"
   ```
4. Copia el valor de `passwordHash` y pégalo en el día correspondiente de `gymkanaConfig.ts`:
   ```ts
   {
     id: 2,
     requiresPassword: true,
     passwordHash: "626b208a365327e7ecd6ad5af2f39c8d08c2ad85a264bd0006450c4d034ba740",
     passwordPlaceholder: "¿A dónde fuimos?",
     ...
   }
   ```
5. Guarda y prueba en local que la contraseña en texto plano (`"Valencia"`, `"valencia"`, `" VALENCIA "`... todo normaliza igual) desbloquea el día.

**Contraseñas placeholder actuales** (a sustituir por las reales antes de lanzar):

| Día | Contraseña placeholder |
|---|---|
| 2 | `valencia` |
| 3 | `perfect` |
| 4 | `carmin` |
| 7 | `sushi` |
| 9 | `gucci` |

---

## 5. Gestión de Assets

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

## 6. Modo Testing

Permite navegar los 11 días **sin esperar a que llegue la fecha real**, para poder probar toda la gymkana de principio a fin antes de regalarla.

**Dos formas de activarlo:**

1. **Gesto oculto en la propia web**: tocar/pulsar 5 veces seguidas (en menos de 2 segundos) el título **"11 Días de Sorpresas"**. Se activa un badge "🧪 Modo Testing activo" y todos los días quedan disponibles en el grid independientemente de su `unlockDate`. El estado se guarda en `localStorage`, así que persiste entre recargas hasta que se vuelva a tocar 5 veces para desactivarlo.
2. **Variable de entorno**: en `.env.local` (copiar desde `.env.local.example`):
   ```
   NEXT_PUBLIC_TESTING_MODE=true
   ```
   Con esto el Modo Testing arranca activado por defecto en ese entorno.

⚠️ **Antes de desplegar la versión real** que verá la persona sorprendida: asegurarse de que `NEXT_PUBLIC_TESTING_MODE` sea `false` (o no exista) en el entorno de producción, y de no dejar el Modo Testing activado (vía el gesto oculto) en el navegador/dispositivo que ella vaya a usar.

---

## 7. Estado actual y pendientes

Esto resume qué está terminado y qué queda por hacer para que la gymkana esté lista para regalarse de verdad. Útil como lista de control al retomar el proyecto.

**Hecho:**
- App completa y funcional: los 11 días son jugables de principio a fin (no hay stubs vacíos).
- Arquitectura modular verificada (build, typecheck y lint en verde).
- Flujo completo probado en navegador: grid con bloqueo por fecha, Modo Testing, gate de contraseña (fallo con shake + acierto), Día 4 con fallback de imagen, Día 11 con confeti y muro de vídeos.
- Repositorio en GitHub (`origin/main`) al día.

**Pendiente antes de regalar la gymkana:**
- Actualizar las 11 `unlockDate` en `gymkanaConfig.ts` para que cubran el rango real de vacaciones (día 2 → día 12 del mes correspondiente), con el Día 11 cayendo en el cumpleaños real.
- Sustituir las 5 contraseñas placeholder (`valencia`, `perfect`, `carmin`, `sushi`, `gucci`) por las reales, generando cada hash con `scripts/generate-hash.mjs`.
- Coordinar con Marta y Dani las claves reales de los Días 4 y 9 (y avisarles de qué frase van a recibir por WhatsApp).
- Producir/editar las fotos reales: `makeup-funny.jpg` (Día 4) y `bag-funny.jpg` (Día 9) — fotos humorísticas o generadas/retocadas con IA de la persona posando.
- Grabar y subir los vídeos: el de ánimo del Día 8 y los vídeos de los amigos del muro del Día 11 (Marta, Dani, Lucía, padres...), actualizando `friendVideos` en el config con sus `videoSrc`.
- Subir la canción del Día 3 (`day3-song.mp3`) y grabar/generar el audio distorsionado del Día 9 (`day9-distorted.mp3`).
- Revisar/editar los textos de acertijos, pistas y quiz para que reflejen recuerdos y bromas reales de la pareja (actualmente son placeholders razonables pero genéricos).
- Antes del día del regalo: desactivar `NEXT_PUBLIC_TESTING_MODE` y comprobar que no queda activado por el gesto oculto en el dispositivo real.
- Desplegar (Vercel u otra plataforma compatible con Next.js) y compartir el enlace.
