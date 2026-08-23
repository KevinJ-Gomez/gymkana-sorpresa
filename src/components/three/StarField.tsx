"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mulberry32 } from "@/lib/random";
import { getStarTexture } from "./textures";

/**
 * Cielo estrellado. Un único sistema de puntos con mucha variación de
 * profundidad: el parallax al desplazarse sale gratis de la perspectiva (las
 * cercanas se mueven más que las lejanas), sin necesidad de capas separadas.
 *
 * El centelleo va en el shader, con una fase distinta por estrella, para que
 * parpadeen de forma desacompasada en vez de latir todas a la vez.
 */

const STAR_COLORS = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#ffe9c4"), // blanco cálido
  new THREE.Color("#cfe0ff"), // azuladas
  new THREE.Color("#ffc7e6"), // rosadas
  new THREE.Color("#fbbf24"), // dorado ocasional
];

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aTwinkle;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSizeScale;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Centelleo: cada estrella con su fase y su ritmo.
    float twinkle = 0.65 + 0.35 * sin(uTime * aTwinkle + aPhase);
    vAlpha = twinkle;

    // Atenuación por distancia hecha a mano (equivale a sizeAttenuation).
    gl_PointSize = aSize * uSizeScale * uPixelRatio * twinkle * (45.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 tex = texture2D(uTexture, gl_PointCoord);
    if (tex.a < 0.01) discard;
    gl_FragColor = vec4(vColor * tex.a, tex.a * vAlpha);
  }
`;

export function StarField({
  count = 2400,
  innerRadius = 42,
  outerRadius = 115,
  centerY = 0,
}: {
  count?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerY?: number;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const random = mulberry32(0xbeef);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const twinkles = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Casquete esférico alrededor del corazón: siempre lejos, nunca entre la
      // cámara y la constelación, y sin bordes rectos que delaten la caja.
      const r = innerRadius + Math.pow(random(), 0.7) * (outerRadius - innerRadius);
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = centerY + r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = STAR_COLORS[Math.floor(random() * STAR_COLORS.length)];
      // Unas pocas brillan mucho más: es lo que da jerarquía al cielo. El resto
      // se mantiene apagado a propósito, para no competir con las 11 del día.
      const brightness = random() < 0.05 ? 0.95 : 0.28 + random() * 0.32;
      colors[i * 3] = color.r * brightness;
      colors[i * 3 + 1] = color.g * brightness;
      colors[i * 3 + 2] = color.b * brightness;

      sizes[i] = random() < 0.05 ? 8 + random() * 6 : 2 + random() * 3;
      phases[i] = random() * Math.PI * 2;
      twinkles[i] = 0.4 + random() * 1.9;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkles, 1));
    return geo;
  }, [count, innerRadius, outerRadius, centerY]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: getStarTexture() },
      uPixelRatio: { value: Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio) },
      uSizeScale: { value: 1 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
