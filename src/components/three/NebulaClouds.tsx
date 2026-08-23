"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getNebulaTexture } from "./textures";

/**
 * Nubes de gas. Cada capa es un plano con la textura de ruido fractal, teñido
 * de un color distinto y girando muy despacio a distinta velocidad.
 *
 * El truco para que no se note que es una textura repetida: cada capa usa una
 * escala, un giro y una semilla diferentes, y al superponerse en aditivo el ojo
 * lee una sola masa de gas continua.
 */

type Layer = {
  color: string;
  position: [number, number, number];
  scale: number;
  rotation: number;
  spin: number;
  opacity: number;
  seed: number;
};

function NebulaLayer({ layer }: { layer: Layer }) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => getNebulaTexture(layer.seed), [layer.seed]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.z = layer.rotation + t * layer.spin;
    // Deriva lateral mínima: la nebulosa "respira" sin marear.
    mesh.current.position.x = layer.position[0] + Math.sin(t * 0.045 + layer.seed) * 0.9;
    mesh.current.position.y = layer.position[1] + Math.cos(t * 0.035 + layer.seed) * 0.6;
  });

  return (
    <mesh ref={mesh} position={layer.position} scale={layer.scale} renderOrder={-10}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        color={layer.color}
        transparent
        opacity={layer.opacity}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

export function NebulaClouds({ centerY = 0 }: { centerY?: number }) {
  const layers = useMemo<Layer[]>(
    () => [
      // Masa principal magenta detrás del corazón.
      { color: "#e0409f", position: [-1.5, centerY + 1.5, -18], scale: 44, rotation: 0.3, spin: 0.006, opacity: 0.6, seed: 7 },
      // Violeta profundo, más grande y más lento: da volumen.
      { color: "#7c3aed", position: [3.5, centerY - 3, -23], scale: 52, rotation: 1.9, spin: -0.004, opacity: 0.5, seed: 13 },
      // Rosa cálido arriba.
      { color: "#fb7185", position: [-4, centerY + 9, -16], scale: 32, rotation: 2.7, spin: 0.008, opacity: 0.4, seed: 21 },
      // Azul frío abajo: el contraste cálido/frío es lo que da riqueza.
      { color: "#3b82f6", position: [4, centerY - 10, -20], scale: 36, rotation: 0.9, spin: -0.007, opacity: 0.34, seed: 33 },
      // Capa por delante del corazón: muy tenue y bastante retrasada. Antes
      // estaba casi pegada a la cámara y lavaba toda la escena de morado.
      { color: "#f0abfc", position: [0, centerY, -10], scale: 30, rotation: 4.1, spin: 0.01, opacity: 0.08, seed: 41 },
    ],
    [centerY],
  );

  return (
    <>
      {layers.map((layer, i) => (
        <NebulaLayer key={i} layer={layer} />
      ))}
    </>
  );
}
