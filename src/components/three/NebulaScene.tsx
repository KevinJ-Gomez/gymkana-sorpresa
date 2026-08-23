"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import type { DayConfig } from "@/types/gymkana";
import { mulberry32 } from "@/lib/random";
import {
  getConstellationPoints,
  getDayPosition,
  getScrollMinY,
  scrollYToIndex,
} from "@/lib/constellation";

export type SphereState = "locked" | "available" | "today" | "solved";

/* -------------------------------------------------------------------------- */
/* Paleta                                                                      */
/* -------------------------------------------------------------------------- */

const DEEP_SPACE = "#0b0620";

/** Colores de la nebulosa: rosa, magenta, violeta vivo y algún destello dorado. */
const NEBULA_COLORS = ["#fb7185", "#d946ef", "#a855f7", "#6366f1", "#f472b6", "#fbbf24"];

const SPHERE_STYLE: Record<
  SphereState,
  { core: string; emissive: string; emissiveIntensity: number; halo: string; haloOpacity: number }
> = {
  // Ojo: una esfera oscura y opaca tapa las partículas aditivas de detrás y
  // se ve como un "agujero negro" recortado en la nebulosa. Por eso la
  // bloqueada es clara y muy translúcida (y no escribe profundidad): parece
  // una estrella apagada, no un vacío.
  locked: {
    core: "#9d94bd",
    emissive: "#3a2f5c",
    emissiveIntensity: 0.45,
    halo: "#8b7fb8",
    haloOpacity: 0.09,
  },
  available: {
    core: "#c4b5fd",
    emissive: "#7c3aed",
    emissiveIntensity: 0.75,
    halo: "#a855f7",
    haloOpacity: 0.14,
  },
  today: {
    core: "#fff0f7",
    emissive: "#ff4d9d",
    emissiveIntensity: 1.6,
    halo: "#ff6fb1",
    haloOpacity: 0.26,
  },
  solved: {
    core: "#ffe9a8",
    emissive: "#f59e0b",
    emissiveIntensity: 1.05,
    halo: "#fbbf24",
    haloOpacity: 0.2,
  },
};

/* -------------------------------------------------------------------------- */
/* Nubes de nebulosa (planos con textura de degradado radial, aditivos)        */
/* -------------------------------------------------------------------------- */

/**
 * Genera una textura de "mancha" difusa por código (canvas 2D) en vez de
 * cargar una imagen: cero peticiones de red y peso cero en el bundle.
 */
function useRadialTexture(color: string) {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    const c = new THREE.Color(color);
    const rgb = `${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}`;
    gradient.addColorStop(0, `rgba(${rgb}, 0.85)`);
    gradient.addColorStop(0.35, `rgba(${rgb}, 0.28)`);
    gradient.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, [color]);
}

function NebulaCloud({
  color,
  position,
  scale,
  drift,
}: {
  color: string;
  position: [number, number, number];
  scale: number;
  drift: number;
}) {
  const texture = useRadialTexture(color);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = t * drift * 0.05;
    ref.current.position.x = position[0] + Math.sin(t * drift * 0.12) * 0.6;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.5}
      />
    </mesh>
  );
}

function NebulaClouds({ minY }: { minY: number }) {
  // Repartidas a lo largo de todo el recorrido vertical, detrás de las esferas.
  const clouds = useMemo(() => {
    const spread = Math.abs(minY);
    return [
      { color: "#d946ef", position: [-2.5, 1.5, -7] as [number, number, number], scale: 16, drift: 1 },
      { color: "#fb7185", position: [3, -spread * 0.22, -8] as [number, number, number], scale: 18, drift: -0.8 },
      { color: "#a855f7", position: [-3, -spread * 0.5, -6.5] as [number, number, number], scale: 15, drift: 1.3 },
      { color: "#6366f1", position: [2.5, -spread * 0.75, -8.5] as [number, number, number], scale: 19, drift: -1.1 },
      { color: "#f472b6", position: [-1.5, minY - 2, -7] as [number, number, number], scale: 16, drift: 0.9 },
    ];
  }, [minY]);

  return (
    <>
      {clouds.map((cloud, i) => (
        <NebulaCloud key={i} {...cloud} />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Campo de partículas                                                         */
/* -------------------------------------------------------------------------- */

function ParticleField({ count, minY }: { count: number; minY: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const random = mulberry32(0x5eed);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    const height = Math.abs(minY) + 14;

    for (let i = 0; i < count; i++) {
      // Distribución en columna alta alrededor de la constelación, más densa
      // en el centro (dos randoms sumados ≈ campana) para que parezca nebulosa.
      const r = (random() + random() - 1) * 9;
      const angle = random() * Math.PI * 2;
      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = 7 - random() * height;
      positions[i * 3 + 2] = r * Math.sin(angle) * 0.7 - 3;

      color.set(NEBULA_COLORS[Math.floor(random() * NEBULA_COLORS.length)]);
      // Brillo variable para dar profundidad.
      const intensity = 0.45 + random() * 0.55;
      colors[i * 3] = color.r * intensity;
      colors[i * 3 + 1] = color.g * intensity;
      colors[i * 3 + 2] = color.b * intensity;
    }
    return { positions, colors };
  }, [count, minY]);

  // Rotación muy lenta: la nebulosa "respira", no marea.
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.014;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/* Esferas de los días                                                         */
/* -------------------------------------------------------------------------- */

function DaySphere({
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
  const style = SPHERE_STYLE[state];
  // Las bloqueadas laten despacio; la de hoy late con más energía.
  const pulseSpeed = state === "locked" ? 1.1 : state === "today" ? 2.4 : 1.6;
  const pulseAmount = state === "locked" ? 0.04 : state === "today" ? 0.1 : 0.06;
  // Desfase derivado del índice: las esferas no laten al unísono, pero el
  // resultado es estable entre renders.
  const phase = (index * 2.399) % (Math.PI * 2);

  useFrame((s) => {
    if (!group.current) return;
    const pulse = 1 + Math.sin(s.clock.elapsedTime * pulseSpeed + phase) * pulseAmount;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group} position={position}>
      {/* Esfera de luz */}
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onTap();
        }}
      >
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color={style.core}
          emissive={style.emissive}
          emissiveIntensity={style.emissiveIntensity}
          roughness={0.35}
          metalness={0.1}
          transparent={state === "locked"}
          opacity={state === "locked" ? 0.38 : 1}
          depthWrite={state !== "locked"}
          toneMapped={false}
        />
      </mesh>

      {/* Halo aditivo: simula el "glow" sin coste de post-procesado (bloom
          es demasiado caro para móvil). */}
      <mesh raycast={() => null} scale={2.2}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={style.halo}
          transparent
          opacity={style.haloOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Zona de toque generosa e invisible: en móvil el dedo es impreciso. */}
      <mesh
        visible={false}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onTap();
        }}
      >
        <sphereGeometry args={[1.05, 8, 8]} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Cámara                                                                      */
/* -------------------------------------------------------------------------- */

function CameraRig({
  focusPosition,
  scrollYRef,
  introMode,
  onArrived,
}: {
  focusPosition: [number, number, number] | null;
  scrollYRef: { current: number };
  introMode: boolean;
  onArrived: () => void;
}) {
  const arrived = useRef(false);
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const target = useRef(new THREE.Vector3());

  useFrame((state, rawDelta) => {
    const camera = state.camera;
    // Cap del delta: si la pestaña estuvo en background, evita un salto brusco.
    const delta = Math.min(rawDelta, 0.1);

    let lookX: number, lookY: number, lookZ: number;

    if (focusPosition) {
      target.current.set(focusPosition[0], focusPosition[1] + 0.1, focusPosition[2] + 1.5);
      [lookX, lookY, lookZ] = focusPosition;
    } else {
      const y = scrollYRef.current;
      target.current.set(0, y, introMode ? 10.5 : 8.6);
      lookX = 0;
      // Mira un poco por debajo del día centrado para que su estrella quede
      // en la mitad superior de la pantalla, libre del HUD inferior.
      lookY = y - 0.7;
      lookZ = 0;
    }

    // Zoom in más rápido que el zoom out: entrar debe sentirse inmersivo.
    const lambda = focusPosition ? 5.5 : 3.6;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x, lambda, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.current.y, lambda, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.current.z, lambda, delta);

    lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, lookX, lambda, delta);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, lookY, lambda, delta);
    lookAt.current.z = THREE.MathUtils.damp(lookAt.current.z, lookZ, lambda, delta);
    camera.lookAt(lookAt.current);

    if (focusPosition) {
      if (!arrived.current && camera.position.distanceTo(target.current) < 0.3) {
        arrived.current = true;
        onArrived();
      }
    } else {
      arrived.current = false;
    }
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/* Escena                                                                      */
/* -------------------------------------------------------------------------- */

function Scene({
  days,
  sphereStates,
  focusPosition,
  scrollYRef,
  introMode,
  onTapDay,
  onArrived,
}: {
  days: DayConfig[];
  sphereStates: SphereState[];
  focusPosition: [number, number, number] | null;
  scrollYRef: { current: number };
  introMode: boolean;
  onTapDay: (id: number) => void;
  onArrived: () => void;
}) {
  const minY = getScrollMinY(days.length);
  const points = useMemo(() => getConstellationPoints(days.length), [days.length]);

  return (
    <>
      <color attach="background" args={[DEEP_SPACE]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 6]} intensity={22} color="#ff8fc7" distance={40} decay={2} />
      <pointLight position={[-4, minY / 2, 5]} intensity={18} color="#a855f7" distance={40} decay={2} />

      <NebulaClouds minY={minY} />
      <ParticleField count={2400} minY={minY} />

      {/* Destellos dorados dispersos */}
      <Sparkles
        count={45}
        scale={[9, Math.abs(minY) + 8, 7]}
        position={[0, minY / 2, -1]}
        size={3.5}
        speed={0.28}
        opacity={0.7}
        color="#fbbf24"
      />

      {/* Línea sutil que une la constelación */}
      <Line
        points={points}
        color="#c4b5fd"
        lineWidth={1}
        transparent
        opacity={0.22}
        raycast={() => null}
      />

      {days.map((day, index) => (
        <DaySphere
          key={day.id}
          position={getDayPosition(index)}
          state={sphereStates[index]}
          index={index}
          onTap={() => onTapDay(day.id)}
        />
      ))}

      <CameraRig
        focusPosition={focusPosition}
        scrollYRef={scrollYRef}
        introMode={introMode}
        onArrived={onArrived}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Componente público                                                          */
/* -------------------------------------------------------------------------- */

export function NebulaScene({
  days,
  sphereStates,
  focusedDayId,
  introMode,
  onTapDay,
  onFocusArrived,
  onCenteredIndexChange,
}: {
  days: DayConfig[];
  sphereStates: SphereState[];
  focusedDayId: number | null;
  introMode: boolean;
  onTapDay: (id: number) => void;
  onFocusArrived: () => void;
  onCenteredIndexChange: (index: number) => void;
}) {
  const scrollY = useRef(0);
  const drag = useRef({ active: false, startY: 0, startScroll: 0, moved: 0 });
  const minY = getScrollMinY(days.length);

  const focusIndex = focusedDayId ? days.findIndex((d) => d.id === focusedDayId) : -1;
  const focusPosition = focusIndex >= 0 ? getDayPosition(focusIndex) : null;

  // Mientras hay un día enfocado el swipe se desactiva: la cámara la manda
  // la transición, no el dedo.
  const dragEnabled = !focusedDayId && !introMode;

  /**
   * El arrastre se escucha a nivel de `window`, no en el div del canvas.
   * Motivo: el pulgar cruza constantemente por encima del HUD (que sí captura
   * toques), y ahí los pointermove dejaban de llegar al canvas y el gesto se
   * cortaba a mitad. Escuchando en window el gesto sobrevive pase por encima
   * de lo que pase.
   */
  useEffect(() => {
    if (!dragEnabled) return;

    function onDown(e: PointerEvent) {
      drag.current = { active: true, startY: e.clientY, startScroll: scrollY.current, moved: 0 };
    }

    function onMove(e: PointerEvent) {
      const d = drag.current;
      if (!d.active) return;
      const dy = e.clientY - d.startY;
      d.moved = Math.max(d.moved, Math.abs(dy));
      // Arrastrar hacia arriba avanza hacia el Día 11 (que está más abajo).
      const next = d.startScroll + dy * 0.018;
      scrollY.current = Math.min(0, Math.max(minY, next));
      onCenteredIndexChange(scrollYToIndex(scrollY.current, days.length));
    }

    function onUp() {
      drag.current.active = false;
    }

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragEnabled, days.length, minY, onCenteredIndexChange]);

  // Un "tap" solo cuenta si el dedo apenas se movió: así deslizar por encima
  // de una esfera no abre su día sin querer.
  const handleTapDay = useCallback(
    (id: number) => {
      if (drag.current.moved > 8) return;
      onTapDay(id);
    },
    [onTapDay],
  );

  return (
    <div className="fixed inset-0 touch-none">
      <Canvas
        // dpr capado a 2: en móviles de 3x el coste por píxel se dispara y
        // se nota en la batería sin ganancia visual real.
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 55, position: [0, 0, 9.5], near: 0.1, far: 120 }}
      >
        <Scene
          days={days}
          sphereStates={sphereStates}
          focusPosition={focusPosition}
          scrollYRef={scrollY}
          introMode={introMode}
          onTapDay={handleTapDay}
          onArrived={onFocusArrived}
        />
      </Canvas>
    </div>
  );
}
