/**
 * Geometría de la constelación: dónde vive en el espacio 3D cada uno de los
 * 11 días. La formación es un zigzag VERTICAL porque la app se usa solo en
 * móvil en vertical: navegar = deslizar el pulgar hacia arriba/abajo.
 *
 * El Día 1 está arriba (y = 0) y los siguientes descienden, así que "avanzar
 * en la gymkana" es literalmente "bajar" por la nebulosa.
 */

/** Distancia vertical entre dos días consecutivos, en unidades de mundo. */
export const DAY_SPACING = 2.6;

/** Posición 3D del día en el índice `index` (0-based). */
export function getDayPosition(index: number): [number, number, number] {
  const y = -index * DAY_SPACING;
  // Zigzag izquierda/derecha, con una variación suave para que no sea un
  // zigzag perfectamente mecánico.
  const side = index % 2 === 0 ? -1 : 1;
  const x = side * (0.95 + (index % 3) * 0.14);
  const z = ((index % 3) - 1) * 0.4;
  return [x, y, z];
}

/** Todas las posiciones, útil para dibujar la línea que une la constelación. */
export function getConstellationPoints(count: number): [number, number, number][] {
  return Array.from({ length: count }, (_, i) => getDayPosition(i));
}

/** Límite inferior del scroll (posición y del último día). */
export function getScrollMinY(count: number): number {
  return -(count - 1) * DAY_SPACING;
}

/** Convierte una posición de scroll (y de cámara) al índice de día más cercano. */
export function scrollYToIndex(scrollY: number, count: number): number {
  const raw = Math.round(-scrollY / DAY_SPACING);
  return Math.min(count - 1, Math.max(0, raw));
}
