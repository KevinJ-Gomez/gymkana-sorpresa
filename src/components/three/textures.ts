import * as THREE from "three";
import { mulberry32 } from "@/lib/random";

/**
 * Texturas generadas por código (canvas 2D). Ni una sola petición de red ni un
 * byte de imagen en el bundle, y se pueden regenerar con otra semilla.
 *
 * Se cachean a nivel de módulo: son caras de generar (sobre todo la nebulosa) y
 * se reutilizan en todos los planos y estrellas.
 */

function cached<T>(store: Map<string, T>, key: string, make: () => T): T {
  let value = store.get(key);
  if (!value) {
    value = make();
    store.set(key, value);
  }
  return value;
}

const textureCache = new Map<string, THREE.CanvasTexture>();

/* -------------------------------------------------------------------------- */
/* Estrella                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Sprite de estrella: núcleo brillante, halo suave y cuatro púas de difracción.
 *
 * Esto es lo que arregla el problema visual más gordo que teníamos: un
 * `PointsMaterial` sin textura pinta CUADRADOS sólidos, y por eso la nebulosa
 * parecía confeti de píxeles en lugar de un cielo estrellado.
 */
export function getStarTexture(): THREE.CanvasTexture {
  return cached(textureCache, "star", () => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;

    // Halo redondo
    const glow = ctx.createRadialGradient(c, c, 0, c, c, c);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(0.12, "rgba(255,255,255,0.85)");
    glow.addColorStop(0.35, "rgba(255,255,255,0.18)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // Púas de difracción (las que hacen que una luz parezca una estrella y no un punto)
    ctx.globalCompositeOperation = "lighter";
    for (const angle of [0, Math.PI / 2]) {
      ctx.save();
      ctx.translate(c, c);
      ctx.rotate(angle);
      const spike = ctx.createLinearGradient(-c, 0, c, 0);
      spike.addColorStop(0, "rgba(255,255,255,0)");
      spike.addColorStop(0.5, "rgba(255,255,255,0.75)");
      spike.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = spike;
      ctx.fillRect(-c, -1.1, size, 2.2);
      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  });
}

/** Destello anamórfico: la raya horizontal ancha típica del cine. */
export function getFlareTexture(): THREE.CanvasTexture {
  return cached(textureCache, "flare", () => {
    const w = 256;
    const h = 64;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
    grad.addColorStop(0.5, "rgba(255,255,255,1)");
    grad.addColorStop(0.65, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;

    // Perfil vertical fino: ancho en el centro, casi nada en los extremos.
    for (let y = 0; y < h; y++) {
      const d = Math.abs(y - h / 2) / (h / 2);
      ctx.globalAlpha = Math.pow(1 - d, 6);
      ctx.fillRect(0, y, w, 1);
    }
    ctx.globalAlpha = 1;

    return new THREE.CanvasTexture(canvas);
  });
}

/* -------------------------------------------------------------------------- */
/* Nebulosa                                                                    */
/* -------------------------------------------------------------------------- */

function makeValueNoise(seed: number) {
  const random = mulberry32(seed);
  const SIZE = 256;
  const grid = new Float32Array(SIZE * SIZE);
  for (let i = 0; i < grid.length; i++) grid[i] = random();

  const at = (x: number, y: number) => grid[(y & (SIZE - 1)) * SIZE + (x & (SIZE - 1))];
  const smooth = (t: number) => t * t * (3 - 2 * t);

  return function noise(x: number, y: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = smooth(x - xi);
    const yf = smooth(y - yi);
    const a = at(xi, yi);
    const b = at(xi + 1, yi);
    const c = at(xi, yi + 1);
    const d = at(xi + 1, yi + 1);
    return a * (1 - xf) * (1 - yf) + b * xf * (1 - yf) + c * (1 - xf) * yf + d * xf * yf;
  };
}

/**
 * Textura de gas nebular: ruido fractal (fBm) con *domain warping*.
 *
 * El warping es lo que convierte un degradado en filamentos: en vez de evaluar
 * el ruido en (x,y), se evalúa en (x,y) desplazado por otro ruido, y eso
 * estira y retuerce las vetas. Es la diferencia entre "mancha difuminada" y
 * "gas".
 *
 * Se calcula en CPU UNA vez y se reutiliza como textura. Un shader fBm por
 * fotograma a pantalla completa sería mucho más caro en un móvil, y como la
 * nebulosa solo deriva lentamente, el resultado es indistinguible.
 */
export function getNebulaTexture(seed = 7): THREE.CanvasTexture {
  return cached(textureCache, `nebula-${seed}`, () => {
    const size = 384;
    const noise = makeValueNoise(seed);

    const fbm = (x: number, y: number, octaves: number) => {
      let value = 0;
      let amplitude = 0.5;
      let frequency = 1;
      for (let i = 0; i < octaves; i++) {
        value += amplitude * noise(x * frequency, y * frequency);
        frequency *= 2.07;
        amplitude *= 0.5;
      }
      return value;
    };

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const image = ctx.createImageData(size, size);
    const data = image.data;

    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const u = (px / size) * 9;
        const v = (py / size) * 9;

        // Domain warping: dos octavas baratas que desplazan el muestreo.
        const wx = fbm(u + 5.2, v + 1.3, 2);
        const wy = fbm(u + 9.7, v + 4.1, 2);
        let density = fbm(u + wx * 2.6, v + wy * 2.6, 4);

        // Contraste: sin esto todo queda gris medio y la nebulosa se ve plana.
        density = Math.pow(Math.max(0, (density - 0.32) / 0.68), 1.7);

        // Caída radial para que el plano no muestre sus bordes rectos.
        const dx = px / size - 0.5;
        const dy = py / size - 0.5;
        const radial = Math.max(0, 1 - Math.hypot(dx, dy) * 2.05);
        const alpha = density * Math.pow(radial, 1.5);

        const i = (py * size + px) * 4;
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = Math.min(255, alpha * 255 * 1.35);
      }
    }

    ctx.putImageData(image, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  });
}
