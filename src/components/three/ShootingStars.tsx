"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mulberry32 } from "@/lib/random";

/**
 * Estrellas fugaces ocasionales. Una sola línea reutilizada que se reprograma
 * con un intervalo aleatorio: sin objetos que crear ni destruir en caliente.
 */

const random = mulberry32(0x5a17);

type Shot = {
  active: boolean;
  wait: number;
  life: number;
  duration: number;
  from: THREE.Vector3;
  dir: THREE.Vector3;
  length: number;
};

export function ShootingStars({
  enabled = true,
  centerY = 0,
}: {
  enabled?: boolean;
  centerY?: number;
}) {
  const line = useRef<THREE.Line>(null);
  const material = useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    return geo;
  }, []);

  const shot = useRef<Shot>({
    active: false,
    wait: 2.5,
    life: 0,
    duration: 1,
    from: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    length: 3,
  });

  useFrame((_, rawDelta) => {
    if (!enabled || !line.current || !material.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const s = shot.current;

    if (!s.active) {
      s.wait -= delta;
      if (s.wait > 0) {
        material.current.opacity = 0;
        return;
      }
      // Nueva fugaz: entra por arriba y cruza en diagonal.
      s.active = true;
      s.life = 0;
      s.duration = 0.7 + random() * 0.5;
      s.length = 2.5 + random() * 3;
      const fromLeft = random() < 0.5;
      s.from.set(
        (fromLeft ? -1 : 1) * (10 + random() * 8),
        centerY + 6 + random() * 12,
        -8 - random() * 12,
      );
      s.dir.set(fromLeft ? 1 : -1, -0.55 - random() * 0.4, 0).normalize();
    }

    s.life += delta;
    const t = s.life / s.duration;
    if (t >= 1) {
      s.active = false;
      s.wait = 3.5 + random() * 7;
      material.current.opacity = 0;
      return;
    }

    const travelled = t * 34;
    const head = s.from.clone().addScaledVector(s.dir, travelled);
    const tail = head.clone().addScaledVector(s.dir, -s.length);

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    arr[0] = head.x; arr[1] = head.y; arr[2] = head.z;
    arr[3] = tail.x; arr[4] = tail.y; arr[5] = tail.z;
    attr.needsUpdate = true;

    // Aparece y se apaga dentro de su propio recorrido.
    material.current.opacity = Math.sin(t * Math.PI) * 0.9;
  });

  if (!enabled) return null;

  return (
    // @ts-expect-error -- `line` colisiona con el SVG <line> en los tipos de JSX,
    // pero aquí es el THREE.Line de react-three-fiber.
    <line ref={line} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        ref={material}
        color="#ffffff"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </line>
  );
}
