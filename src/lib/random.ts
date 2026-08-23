/**
 * PRNG determinista (mulberry32).
 *
 * La nebulosa se genera con números pseudoaleatorios, pero usar `Math.random()`
 * durante el render es impuro: si React vuelve a ejecutar el `useMemo`, la
 * nebulosa entera cambiaría de forma. Con una semilla fija el resultado es
 * siempre idéntico y además es reproducible al depurar.
 */
export function mulberry32(seed: number): () => number {
  let state = seed;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
