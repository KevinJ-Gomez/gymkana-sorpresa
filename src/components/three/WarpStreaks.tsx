"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mulberry32 } from "@/lib/random";

/**
 * Salto a hiperespacio: las estrellas se estiran en líneas de velocidad que
 * pasan de largo junto a la cámara.
 *
 * Son `LineSegments` (2 vértices por raya) en vez de sprites: estirar una línea
 * es gratis, mientras que estirar un sprite obligaría a rotarlo y escalarlo uno
 * a uno en CPU.
 *
 * El componente lleva su propio progreso: recibir el progreso por props
 * obligaría a re-renderizar React 60 veces por segundo, que es justo lo que
 * `useFrame` existe para evitar.
 */

const COUNT = 220;
const FIELD_RADIUS = 9;
const START_Z = -55;
const END_Z = 6;
const DURATION = 2.1;

export function WarpStreaks({ active }: { active: boolean }) {
  const lines = useRef<THREE.LineSegments>(null);
  const material = useRef<THREE.LineBasicMaterial>(null);
  const progress = useRef(0);
  const wasActive = useRef(false);

  // Las posiciones de partida viven en `userData` de la geometría (un objeto de
  // three, no un local de React) para poder mutarlas por fotograma sin pelearse
  // con las reglas de pureza de React.
  const geometry = useMemo(() => {
    const random = mulberry32(0x77aa);
    const positions = new Float32Array(COUNT * 2 * 3);
    const colors = new Float32Array(COUNT * 2 * 3);
    const seeds = new Float32Array(COUNT * 3);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#ffd9ec"),
      new THREE.Color("#c4b5fd"),
      new THREE.Color("#fbbf24"),
    ];

    for (let i = 0; i < COUNT; i++) {
      // Repartidas en un anillo: el centro se deja despejado para que se lea
      // como un túnel y no como una pared de rayas.
      const angle = random() * Math.PI * 2;
      const r = 0.8 + Math.sqrt(random()) * FIELD_RADIUS;
      seeds[i * 3] = Math.cos(angle) * r;
      seeds[i * 3 + 1] = Math.sin(angle) * r;
      seeds[i * 3 + 2] = START_Z + random() * (END_Z - START_Z);

      const color = palette[Math.floor(random() * palette.length)];
      for (let v = 0; v < 2; v++) {
        colors[(i * 2 + v) * 3] = color.r;
        colors[(i * 2 + v) * 3 + 1] = color.g;
        colors[(i * 2 + v) * 3 + 2] = color.b;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.userData.seeds = seeds;
    return geo;
  }, []);

  useFrame((_, rawDelta) => {
    if (!lines.current || !material.current) return;

    // Cada salto nuevo arranca de cero.
    if (active && !wasActive.current) progress.current = 0;
    wasActive.current = active;
    if (!active) return;

    const delta = Math.min(rawDelta, 0.05);
    progress.current = Math.min(1, progress.current + delta / DURATION);
    const p = progress.current;

    const geo = lines.current.geometry;
    const seeds = geo.userData.seeds as Float32Array;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const array = attr.array as Float32Array;

    // Curva de velocidad: acelerón al principio, frenada al final (el "llegar").
    const speed = 90 * Math.sin(p * Math.PI) + 12;
    const length = 2 + 26 * Math.sin(p * Math.PI);
    const step = speed * delta;

    for (let i = 0; i < COUNT; i++) {
      let z = seeds[i * 3 + 2] + step;
      if (z > END_Z) z = START_Z + ((z - END_Z) % (END_Z - START_Z));
      seeds[i * 3 + 2] = z;

      const x = seeds[i * 3];
      const y = seeds[i * 3 + 1];
      const head = i * 6;
      array[head] = x;
      array[head + 1] = y;
      array[head + 2] = z;
      array[head + 3] = x;
      array[head + 4] = y;
      array[head + 5] = z - length;
    }
    attr.needsUpdate = true;

    // Entra y sale con el propio salto.
    material.current.opacity = Math.sin(p * Math.PI) * 0.95;
  });

  if (!active) return null;

  return (
    <lineSegments ref={lines} geometry={geometry} frustumCulled={false} renderOrder={10}>
      <lineBasicMaterial
        ref={material}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </lineSegments>
  );
}
