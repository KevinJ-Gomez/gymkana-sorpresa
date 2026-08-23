/**
 * Geometría de la constelación: las 11 estrellas dibujan un CORAZÓN.
 *
 * La curva es la clásica cardioide de San Valentín:
 *   x = 16 sin³t
 *   y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t
 *
 * Los 11 días se reparten por **longitud de arco** (no por el parámetro t,
 * que se acelera en las curvas cerradas y dejaría estrellas amontonadas en
 * los lóbulos y separadas en la punta).
 *
 * El Día 11 —el cumpleaños— cae exactamente en la punta inferior del corazón,
 * que es el vértice más reconocible de la figura: al encenderlo, la silueta
 * queda cerrada.
 */

const HEART_SCALE = 0.42;
/** Muestras para construir la tabla de longitud de arco. */
const ARC_SAMPLES = 1440;

function heartRaw(t: number): [number, number] {
  const sin = Math.sin(t);
  const x = 16 * sin * sin * sin;
  const y =
    13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x * HEART_SCALE, y * HEART_SCALE];
}

/** Tabla acumulada de longitud de arco, para poder repartir a distancias iguales. */
const ARC_TABLE = (() => {
  const ts: number[] = [];
  const cum: number[] = [];
  let total = 0;
  let [px, py] = heartRaw(0);
  ts.push(0);
  cum.push(0);
  for (let i = 1; i <= ARC_SAMPLES; i++) {
    const t = (i / ARC_SAMPLES) * Math.PI * 2;
    const [x, y] = heartRaw(t);
    total += Math.hypot(x - px, y - py);
    ts.push(t);
    cum.push(total);
    px = x;
    py = y;
  }
  return { ts, cum, total };
})();

/** Punto del corazón a una fracción [0,1) del recorrido total. */
function pointAtFraction(fraction: number): [number, number] {
  const f = ((fraction % 1) + 1) % 1;
  const target = f * ARC_TABLE.total;
  const { cum, ts } = ARC_TABLE;

  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= target) lo = mid;
    else hi = mid;
  }
  const span = cum[hi] - cum[lo] || 1;
  const k = (target - cum[lo]) / span;
  const t = ts[lo] + (ts[hi] - ts[lo]) * k;
  return heartRaw(t);
}

/** Fracción del recorrido en la que está la punta inferior del corazón (t = π). */
const BOTTOM_TIP_FRACTION = (() => {
  const { ts, cum, total } = ARC_TABLE;
  let lo = 0;
  while (lo < ts.length - 2 && ts[lo + 1] < Math.PI) lo++;
  return cum[lo] / total;
})();

/**
 * Fracción del recorrido para el día en la posición `u`.
 * `u` es continuo (2.4 = entre el día 3 y el 4), que es lo que permite que la
 * cámara viaje suavemente por la curva en vez de saltar de estrella a estrella.
 */
function fractionForIndex(u: number, count: number): number {
  // Desplazado para que el último día (u = count-1) caiga en la punta.
  return BOTTOM_TIP_FRACTION + (u - (count - 1)) / count;
}

/** Profundidad suave: el corazón no es plano del todo, respira hacia el eje Z. */
function depthForIndex(u: number): number {
  return Math.sin(u * 1.7) * 0.45;
}

/** Posición 3D de la estrella del día en el índice `index` (0-based). */
export function getDayPosition(index: number, count = 11): [number, number, number] {
  const [x, y] = pointAtFraction(fractionForIndex(index, count));
  return [x, y, depthForIndex(index)];
}

/** Punto continuo del recorrido, para mover la cámara entre estrellas. */
export function getPathPoint(u: number, count = 11): [number, number, number] {
  const [x, y] = pointAtFraction(fractionForIndex(u, count));
  return [x, y, depthForIndex(u)];
}

/** Todas las posiciones de los días. */
export function getDayPositions(count = 11): [number, number, number][] {
  return Array.from({ length: count }, (_, i) => getDayPosition(i, count));
}

/**
 * Silueta del corazón, muy densa, para dibujar la constelación como una curva
 * de verdad y no como un polígono de 11 lados.
 *
 * Ojo con el rango: recorre `u` de 0 a `count` (no a `count-1`). Cada paso vale
 * 1/count del perímetro, así que 0..count es exactamente una vuelta completa y
 * el corazón CIERRA. Con 0..count-1 quedaba abierto un tramo entre la punta
 * (Día 11) y el Día 1, y la silueta se veía rota por abajo a la izquierda.
 */
export function getHeartOutline(segments = 240, count = 11): [number, number, number][] {
  return getPathSegment(0, count, segments, count);
}

/**
 * Tramo de la curva entre dos posiciones continuas del recorrido, con
 * suficientes puntos para que se vea curvo. Se usa para la línea dorada del
 * progreso: va del Día 1 hasta el último día resuelto.
 */
export function getPathSegment(
  from: number,
  to: number,
  segments: number,
  count = 11,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  const steps = Math.max(2, Math.round(segments));
  for (let i = 0; i <= steps; i++) {
    points.push(getPathPoint(from + ((to - from) * i) / steps, count));
  }
  // Si el tramo da una vuelta completa (el contorno del corazón siempre; la
  // línea dorada al resolver el Día 11), el último punto coincide EXACTO con
  // el primero. Ese segmento de longitud cero rompe el cálculo de dirección
  // de las fat-lines (`Line2`, usadas para el `lineWidth` > 1): en el
  // escritorio (precisión `highp`) no se nota, pero en GPUs móviles
  // (`mediump`) se ve como una línea recta que atraviesa toda la pantalla.
  const [fx, fy, fz] = points[0];
  const [lx, ly, lz] = points[points.length - 1];
  if (points.length > 1 && fx === lx && fy === ly && fz === lz) {
    points.pop();
  }
  return points;
}

/** Centro y tamaño del corazón, para encuadrarlo entero en el modo mapa. */
export function getHeartBounds(count = 11) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i <= 720; i++) {
    const [x, y] = pointAtFraction(i / 720);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return {
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    width: maxX - minX,
    height: maxY - minY,
    count,
  };
}

/** Índice de día más cercano a una posición continua del recorrido. */
export function pathPosToIndex(pathPos: number, count: number): number {
  return Math.min(count - 1, Math.max(0, Math.round(pathPos)));
}
