"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { getHeartOutline, getPathPoint, getPathSegment } from "@/lib/constellation";
import { getStarTexture } from "./textures";

/**
 * La silueta del corazón y el progreso sobre ella.
 *
 * Tres capas:
 *  1. El contorno completo, muy tenue: siempre visible, para que se intuya la
 *     figura que hay que completar desde el primer día.
 *  2. El tramo ya conseguido, en dorado: crece día a día. Al resolver el Día 11
 *     la curva cierra y el corazón queda entero.
 *  3. Un pulso de luz que recorre el camino hacia la estrella de hoy, como
 *     energía yendo a buscarla.
 */

export function ConstellationPath({
  count,
  solvedProgress,
  pulseTarget,
}: {
  count: number;
  /** Hasta qué punto del recorrido está resuelto (0..count). */
  solvedProgress: number;
  /** Posición del recorrido hacia la que viaja el pulso de luz. */
  pulseTarget: number;
}) {
  const pulse = useRef<THREE.Sprite>(null);
  const pulseTime = useRef(0);

  const outline = useMemo(() => getHeartOutline(260, count), [count]);

  // El tramo dorado se recalcula solo cuando cambia el progreso, no cada frame.
  const solved = useMemo(() => {
    if (solvedProgress <= 0) return null;
    return getPathSegment(0, solvedProgress, Math.max(8, solvedProgress * 26), count);
  }, [solvedProgress, count]);

  useFrame((_, delta) => {
    if (!pulse.current) return;
    pulseTime.current += delta * 0.42;
    const cycle = pulseTime.current % 1;

    // Recorre desde el principio hasta la estrella objetivo, y vuelve a salir.
    const u = cycle * Math.max(0.001, pulseTarget);
    const [x, y, z] = getPathPoint(u, count);
    pulse.current.position.set(x, y, z);

    // Se desvanece en los extremos para que aparezca y desaparezca con suavidad.
    const fade = Math.sin(cycle * Math.PI);
    pulse.current.material.opacity = fade * 0.85;
    const scale = 0.5 + fade * 0.5;
    pulse.current.scale.set(scale, scale, 1);
  });

  return (
    <>
      <Line
        points={outline}
        color="#c4b5fd"
        lineWidth={1}
        transparent
        opacity={0.2}
        raycast={() => null}
      />

      {solved && (
        <Line
          points={solved}
          color="#fbbf24"
          lineWidth={2}
          transparent
          opacity={0.75}
          raycast={() => null}
        />
      )}

      <sprite ref={pulse} scale={0.9}>
        <spriteMaterial
          map={getStarTexture()}
          color="#ffe9a8"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </>
  );
}
