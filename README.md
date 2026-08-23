# 11 Días de Sorpresas 🎁

Gymkana digital de cumpleaños construida con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** y **Framer Motion**. Es un calendario de adviento de 11 días: cada día se desbloquea resolviendo un acertijo o introduciendo una contraseña que la persona sorprendida consigue hablando con amigos por WhatsApp.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (animaciones, shake, transiciones)
- canvas-confetti (Día 11)
- lucide-react (iconos)
- Web Crypto API (`crypto.subtle`) para hashear contraseñas en cliente — sin dependencias extra

## Arranque rápido

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

```
src/
  app/
    page.tsx           # Renderiza <GymkanaApp />
    layout.tsx          # Metadata + fuentes
    globals.css          # Tema (fondo oscuro romántico)
  config/
    gymkanaConfig.ts     # ⚙️ TODA la config: fechas, textos, acertijos, hashes
  types/
    gymkana.ts            # Tipos (DayConfig, DayComponentProps, ...)
  lib/
    hash.ts               # SHA-256 en cliente (Web Crypto API)
    dates.ts               # Lógica de desbloqueo por fecha
    storage.ts              # Progreso + Modo Testing (localStorage)
  components/
    GymkanaApp.tsx          # Orquestador: grid <-> detalle de día
    DayGrid.tsx / DayCard.tsx  # Grid de 11 "candados"
    DayContainer.tsx         # Componente GENÉRICO: gestiona el gate de contraseña
    ui/
      GlassCard.tsx           # Panel glassmorphism reutilizable
      GiftImageReveal.tsx      # Imagen con fallback si el fichero no existe
    days/
      Day1.tsx ... Day11.tsx    # Un componente AISLADO por día (el "premio")
      index.ts                   # Registro id -> componente
scripts/
  generate-hash.mjs         # CLI para generar el hash de una contraseña nueva
public/
  makeup-funny.jpg           # (añádela tú) Día 4
  bag-funny.jpg               # (añádela tú) Día 9
  audio/                       # Canción del Día 3, audio distorsionado del Día 9
  videos/                       # Vídeo de ánimo del Día 8, vídeos de amigos del Día 11
```

## Cómo funciona la arquitectura

1. **`gymkanaConfig.ts` es la única fuente de verdad.** Fechas, textos de acertijos, pistas, contraseñas (hasheadas) y rutas de imágenes/vídeos viven ahí. Los componentes solo leen esos datos — no hay texto "quemado" en el JSX de un día concreto.
2. **`DayContainer.tsx` es el componente genérico.** Si `day.requiresPassword` es `true`, pinta el formulario de contraseña, calcula el SHA-256 del input y lo compara contra `day.passwordHash`. Si falla, dispara la animación de shake; si acierta, llama a `onUnlock()` y pasa a mostrar el contenido del día.
3. **Cada día es un componente aislado** en `src/components/days/Day{n}.tsx`, registrado en `days/index.ts`. Recibe siempre las mismas props (`config`, `isUnlocked`, `onUnlock`), así que añadir un día nuevo es: crear el fichero, registrar el id, y rellenar su entrada en `gymkanaConfig.ts`.
4. **Días sin contraseña** (1, 5, 6, 8, 10, 11) implementan su propio reto dentro del componente (quiz, puzzle, minijuego, mensaje al revés) y llaman a `onUnlock()` cuando el usuario lo supera.

## Añadir o cambiar acertijos y contraseñas

Todo se edita en **`src/config/gymkanaConfig.ts`**. Cada día es un objeto del array `gymkanaConfig`:

```ts
{
  id: 4,
  unlockDate: "2026-09-04",
  title: "El secreto del maquillaje",
  icon: "💄",
  giftLabel: "Maquillaje",
  requiresPassword: true,
  passwordHash: "76220309bfa2825db730089f962529ad08e1ba7dc7b9d7b5304832474444eb3f",
  passwordPlaceholder: "Clave secreta",
  riddle: "Hoy no hay acertijo que valga...",
  hintExtra: "Pista: escríbele por WhatsApp a Marta...",
  rewardTitle: "Te espera en casa",
  imageSrc: "/makeup-funny.jpg",
  imageCaption: "Sí, este es tu regalo.",
}
```

Revisa `src/types/gymkana.ts` para ver qué campos usa cada día (están comentados uno a uno).

### Generar el hash de una contraseña nueva

Las contraseñas **nunca** se guardan en texto plano — se compara el SHA-256 del input contra `passwordHash`. Para generar uno nuevo:

```bash
node scripts/generate-hash.mjs "mi-clave-secreta"
```

Copia el `passwordHash` que imprime y pégalo en la entrada del día correspondiente. La normalización (minúsculas + sin espacios al principio/final) es automática tanto en el script como en el navegador, así que "Valencia", " valencia " y "VALENCIA" generan el mismo hash.

> Esto disuade el "view-source" casual de alguien fisgoneando el código, no es un secreto de nivel bancario — no hay backend. Suficiente para una gymkana de cumpleaños.

## Añadir imágenes, audio y vídeo a `/public`

- **Día 4** — `public/makeup-funny.jpg`
- **Día 9** — `public/bag-funny.jpg`
- **Día 3** — `public/audio/day3-song.mp3` (canción) — ver `public/audio/README.md`
- **Día 9** — `public/audio/day9-distorted.mp3` (pista de audio distorsionada)
- **Día 8** — `public/videos/day8-animo.mp4` — ver `public/videos/README.md`
- **Día 11** — vídeos de amigos: añade el fichero a `public/videos/` y referencia la ruta en `friendVideos[].videoSrc` dentro de `gymkanaConfig.ts`

Si un fichero todavía no existe, la app **no se rompe**: `GiftImageReveal` muestra un placeholder elegante indicando dónde colocar la imagen, y los `<video>`/`<audio>` simplemente no reproducen nada.

## Modo Testing

Permite navegar los 11 días ignorando las fechas de desbloqueo, para poder probar toda la gymkana antes de regalarla.

Dos formas de activarlo:

1. **Variable de entorno** — en `.env.local`:
   ```
   NEXT_PUBLIC_TESTING_MODE=true
   ```
2. **Gesto oculto** — toca 5 veces seguidas (en menos de 2 segundos) el título "11 Días de Sorpresas" en la propia app. Queda guardado en `localStorage`, así que persiste entre recargas hasta que lo vuelvas a tocar 5 veces.

⚠️ Antes de desplegar la versión que verá la persona sorprendida, asegúrate de que `NEXT_PUBLIC_TESTING_MODE` sea `false` (o no exista) y de no dejar el modo activado en el navegador que use ella.

## Progreso persistente

Los días ya resueltos se guardan en `localStorage` (`gymkana:unlocked-days`), así que refrescar la página no obliga a repetir un acertijo ya superado.

## Fechas

Cada día define `unlockDate` en formato `"YYYY-MM-DD"`. Las 11 fechas de ejemplo en el repo son placeholders (`2026-09-01` a `2026-09-11`) — cámbialas por las fechas reales de tu gymkana, terminando en el cumpleaños (Día 11).

## Despliegue

Cualquier plataforma compatible con Next.js sirve (Vercel, etc.). Solo recuerda configurar `NEXT_PUBLIC_TESTING_MODE=false` en el entorno de producción.
