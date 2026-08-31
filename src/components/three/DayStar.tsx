"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { getFlareTexture, getStarTexture } from "./textures";

export type SphereState = "locked" | "available" | "today" | "solved";

/**
 * Una estrella del corazón. El "glow" se consigue con sprites aditivos, no con
 * post-procesado: un bloom real es demasiado caro para un móvil, y el cine
 * lleva décadas fingiéndolo con destellos superpuestos.
 */

const STYLE: Record<
  SphereState,
  {
    core: string;
    glow: string;
    coreScale: number;
    glowScale: number;
    glowOpacity: number;
    flare: number;
    pulseSpeed: number;
    pulseAmount: number;
  }
> = {
  // Apagada: translúcida y clara. Si fuese oscura y opaca taparía el gas de
  // detrás y se leería como un agujero recortado en la nebulosa.
  locked: {
    core: "#c9c2e4",
    glow: "#9d90d8",
    coreScale: 0.62,
    glowScale: 2.1,
    glowOpacity: 0.42,
    flare: 0,
    pulseSpeed: 1.1,
    pulseAmount: 0.05,
  },
  available: {
    core: "#ddd6fe",
    glow: "#a855f7",
    coreScale: 0.85,
    glowScale: 3.1,
    glowOpacity: 0.75,
    flare: 0,
    pulseSpeed: 1.6,
    pulseAmount: 0.07,
  },
  today: {
    core: "#ffffff",
    glow: "#ff5ba7",
    coreScale: 1.25,
    glowScale: 5,
    glowOpacity: 1,
    flare: 1,
    pulseSpeed: 2.3,
    pulseAmount: 0.12,
  },
  solved: {
    core: "#fff3cd",
    glow: "#fbbf24",
    coreScale: 1,
    glowScale: 3.8,
    glowOpacity: 0.9,
    flare: 0.55,
    pulseSpeed: 1.4,
    pulseAmount: 0.06,
  },
};

export function DayStar({
  position,
  state,
  index,
  onTap,
}: {
  position: [number, number, number];
  state: SphereState;
  index: number;
  onTap: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const corona = useRef<THREE.Sprite>(null);
  const flare = useRef<THREE.Sprite>(null);
  const style = STYLE[state];
  // Desfase derivado del índice: no laten al unísono, pero es estable entre
  // renders (nada de Math.random durante el render).
  const phase = (index * 2.399) % (Math.PI * 2);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * style.pulseSpeed + phase) * style.pulseAmount;
    if (group.current) group.current.scale.setScalar(pulse);
    // Corona girando muy despacio: da sensación de energía viva.
    if (corona.current) corona.current.material.rotation = t * 0.25 + phase;
    if (flare.current) {
      const shimmer = 0.75 + 0.25 * Math.sin(t * 1.9 + phase);
      flare.current.material.opacity = style.flare * shimmer;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Núcleo sólido: pequeño, es el punto de luz duro */}
      <mesh scale={style.coreScale}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial
          color={style.core}
          transparent
          opacity={state === "locked" ? 0.5 : 1}
          toneMapped={false}
        />
      </mesh>

      {/* Halo/corona */}
      <sprite ref={corona} scale={style.glowScale}>
        <spriteMaterial
          map={getStarTexture()}
          color={style.glow}
          transparent
          opacity={style.glowOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* Destello anamórfico horizontal (solo hoy y completadas) */}
      {style.flare > 0 && (
        <sprite ref={flare} scale={[style.glowScale * 2.6, style.glowScale * 0.42, 1]}>
          <spriteMaterial
            map={getFlareTexture()}
            color={style.glow}
            transparent
            opacity={style.flare}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      )}

      {/* Zona de toque generosa e invisible: en móvil el dedo es impreciso y la
          estrella visible es pequeña a propósito. */}
      <mesh
        visible={false}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onTap();
        }}
      >
        <sphereGeometry args={[0.95, 8, 8]} />
      </mesh>
    </group>
  );
}
