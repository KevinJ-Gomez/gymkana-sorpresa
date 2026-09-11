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
  // Apagada (bloqueada): núcleo tenue pétalo apagado, sin brillo ni destello
  locked: {
    core: "#6b3a4c",
    glow: "#4a1d2e",
    coreScale: 0.42,
    glowScale: 1.0,
    glowOpacity: 0,
    flare: 0,
    pulseSpeed: 0.5,
    pulseAmount: 0.01,
  },
  // Apagada (disponible pero reto no completado): núcleo pétalo visible, sutil latido
  available: {
    core: "#9f496e",
    glow: "#831843",
    coreScale: 0.52,
    glowScale: 1.2,
    glowOpacity: 0,
    flare: 0,
    pulseSpeed: 0.8,
    pulseAmount: 0.02,
  },
  // Día activo/hoy (reto pendiente): estrella que parpadea con aura de flor cálida
  today: {
    core: "#fce7f3",
    glow: "#f472b6",
    coreScale: 0.7,
    glowScale: 2.0,
    glowOpacity: 0.16,
    flare: 0,
    pulseSpeed: 1.3,
    pulseAmount: 0.06,
  },
  // ¡BRILLANDO! (Acertijo completado): resplandor radiante frambuesa/cera y destello dorado/rosado
  solved: {
    core: "#ffffff",
    glow: "#f472b6",
    coreScale: 1.25,
    glowScale: 4.8,
    glowOpacity: 1.0,
    flare: 1.0,
    pulseSpeed: 2.2,
    pulseAmount: 0.12,
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
          opacity={
            state === "solved"
              ? 1
              : state === "today"
              ? 0.75
              : state === "available"
              ? 0.5
              : 0.35
          }
          toneMapped={false}
        />
      </mesh>

      {/* Halo/corona (solo presente si la estrella tiene resplandor) */}
      {style.glowOpacity > 0 && (
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
      )}

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
