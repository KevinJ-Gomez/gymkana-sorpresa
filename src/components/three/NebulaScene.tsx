"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import type { DayConfig } from "@/types/gymkana";
import {
  getDayPositions,
  getHeartBounds,
  getPathPoint,
  pathPosToIndex,
} from "@/lib/constellation";
import { DayStar, type SphereState } from "./DayStar";
import { ConstellationPath } from "./ConstellationPath";
import { NebulaClouds } from "./NebulaClouds";
import { StarField } from "./StarField";
import { ShootingStars } from "./ShootingStars";
import { WarpStreaks } from "./WarpStreaks";

export type { SphereState };

const DEEP_SPACE = "#07031a";
/** Distancia de cámara recorriendo la constelación de cerca. */
const TRAVEL_DIST = 8.6;
/** Distancia de partida de la intro, desde donde arranca el salto. */
const INTRO_DIST = 52;
const WARP_DURATION = 2.1;
/** Píxeles arrastrados por día de recorrido. */
const DRAG_PER_INDEX = 0.005;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* -------------------------------------------------------------------------- */
/* Cámara                                                                      */
/* -------------------------------------------------------------------------- */

function CameraRig({
  count,
  pathPos,
  mapView,
  focusPosition,
  warping,
  onWarpComplete,
  onFocusArrived,
}: {
  count: number;
  pathPos: { current: number };
  mapView: boolean;
  focusPosition: [number, number, number] | null;
  warping: boolean;
  onWarpComplete: () => void;
  onFocusArrived: () => void;
}) {
  const bounds = useMemo(() => getHeartBounds(count), [count]);
  const zoom = useRef(mapView ? 1 : 0);
  const warp = useRef(warping ? 0 : 1);
  const arrived = useRef(false);
  const lookAt = useRef(new THREE.Vector3(bounds.centerX, bounds.centerY, 0));
  const target = useRef(new THREE.Vector3());

  // Al empezar un salto nuevo se reinicia el progreso.
  useEffect(() => {
    if (warping) warp.current = 0;
  }, [warping]);

  useFrame((state, rawDelta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const delta = Math.min(rawDelta, 0.1);

    // --- Distancia del modo mapa, calculada para que el corazón quepa entero
    // en la pantalla real (depende del aspecto, que en móvil es muy estrecho).
    const vFov = (camera.fov * Math.PI) / 180;
    const fitHeight = (bounds.height * 1.25) / (2 * Math.tan(vFov / 2));
    const fitWidth = (bounds.width * 1.25) / (2 * Math.tan(vFov / 2) * camera.aspect);
    const mapDist = Math.max(fitHeight, fitWidth);

    zoom.current = THREE.MathUtils.damp(zoom.current, mapView ? 1 : 0, 3.2, delta);

    let lookX: number;
    let lookY: number;
    let lookZ: number;

    if (focusPosition) {
      target.current.set(focusPosition[0], focusPosition[1] + 0.1, focusPosition[2] + 1.5);
      [lookX, lookY, lookZ] = focusPosition;
    } else {
      const [px, py, pz] = getPathPoint(pathPos.current, count);
      // Mezcla continua entre "viajando de cerca" y "mapa del corazón entero".
      const z = zoom.current;
      target.current.set(
        THREE.MathUtils.lerp(px, bounds.centerX, z),
        THREE.MathUtils.lerp(py, bounds.centerY, z),
        THREE.MathUtils.lerp(pz + TRAVEL_DIST, mapDist, z),
      );
      lookX = THREE.MathUtils.lerp(px, bounds.centerX, z);
      // De cerca mira algo por debajo, para que la estrella quede en la mitad
      // superior y no la tape el HUD.
      lookY = THREE.MathUtils.lerp(py - 0.7, bounds.centerY, z);
      lookZ = THREE.MathUtils.lerp(pz, 0, z);
    }

    // --- Salto a hiperespacio: la cámara llega desde muy lejos.
    if (warp.current < 1) {
      warp.current = Math.min(1, warp.current + delta / WARP_DURATION);
      const eased = easeInOutCubic(warp.current);
      target.current.z += (1 - eased) * (INTRO_DIST - TRAVEL_DIST);

      // Golpe de campo de visión: es lo que vende la sensación de velocidad.
      const punch = Math.sin(warp.current * Math.PI);
      const fov = 55 + punch * 42;
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }

      // Durante el salto la cámara va directa, sin amortiguar.
      camera.position.copy(target.current);
      lookAt.current.set(lookX, lookY, lookZ);
      camera.lookAt(lookAt.current);

      if (warp.current >= 1) {
        camera.fov = 55;
        camera.updateProjectionMatrix();
        onWarpComplete();
      }
      return;
    }

    const lambda = focusPosition ? 5.5 : 3.4;
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
        onFocusArrived();
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
  positions,
  solvedProgress,
  pulseTarget,
  pathPos,
  mapView,
  focusPosition,
  warping,
  onTapDay,
  onWarpComplete,
  onFocusArrived,
}: {
  days: DayConfig[];
  sphereStates: SphereState[];
  positions: [number, number, number][];
  solvedProgress: number;
  pulseTarget: number;
  pathPos: { current: number };
  mapView: boolean;
  focusPosition: [number, number, number] | null;
  warping: boolean;
  onTapDay: (id: number) => void;
  onWarpComplete: () => void;
  onFocusArrived: () => void;
}) {
  const bounds = useMemo(() => getHeartBounds(days.length), [days.length]);

  return (
    <>
      <color attach="background" args={[DEEP_SPACE]} />

      <NebulaClouds centerY={bounds.centerY} />
      <StarField centerY={bounds.centerY} />
      <ShootingStars enabled={!warping} centerY={bounds.centerY} />

      <ConstellationPath
        count={days.length}
        solvedProgress={solvedProgress}
        pulseTarget={pulseTarget}
      />

      {days.map((day, index) => (
        <DayStar
          key={day.id}
          position={positions[index]}
          state={sphereStates[index]}
          index={index}
          onTap={() => onTapDay(day.id)}
        />
      ))}

      <WarpStreaks active={warping} />

      <CameraRig
        count={days.length}
        pathPos={pathPos}
        mapView={mapView}
        focusPosition={focusPosition}
        warping={warping}
        onWarpComplete={onWarpComplete}
        onFocusArrived={onFocusArrived}
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
  solvedCount,
  todayIndex,
  focusedDayId,
  mapView,
  warping,
  onTapDay,
  onFocusArrived,
  onWarpComplete,
  onCenteredIndexChange,
  onMapViewChange,
}: {
  days: DayConfig[];
  sphereStates: SphereState[];
  /** Días resueltos de forma consecutiva desde el principio (para la línea dorada). */
  solvedCount: number;
  todayIndex: number;
  focusedDayId: number | null;
  mapView: boolean;
  warping: boolean;
  onTapDay: (id: number) => void;
  onFocusArrived: () => void;
  onWarpComplete: () => void;
  onCenteredIndexChange: (index: number) => void;
  onMapViewChange: (mapView: boolean) => void;
}) {
  const pathPos = useRef(0);
  const drag = useRef({ active: false, startY: 0, startPos: 0, moved: 0 });
  const pinch = useRef({ active: false, startDist: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const positions = useMemo(() => getDayPositions(days.length), [days.length]);
  const focusIndex = focusedDayId ? days.findIndex((d) => d.id === focusedDayId) : -1;
  const focusPosition = focusIndex >= 0 ? positions[focusIndex] : null;

  // El corazón se ilumina en dorado desde el Día 1 hasta el último resuelto
  // seguido. Al resolver el Día 11 la curva cierra sobre sí misma.
  const solvedProgress = solvedCount >= days.length ? days.length : solvedCount;
  const pulseTarget = Math.max(0.5, todayIndex);

  const gesturesEnabled = !focusedDayId && !warping;

  /**
   * Gestos a nivel de `window`: el pulgar cruza constantemente por encima del
   * HUD, y escuchando solo en el div del canvas el arrastre se cortaba en seco
   * al pasar por encima de un botón.
   */
  useEffect(() => {
    if (!gesturesEnabled) return;

    const dist = () => {
      const [a, b] = [...pointers.current.values()];
      return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    };

    function onDown(e: PointerEvent) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2) {
        pinch.current = { active: true, startDist: dist() };
        drag.current.active = false;
      } else if (pointers.current.size === 1) {
        drag.current = { active: true, startY: e.clientY, startPos: pathPos.current, moved: 0 };
      }
    }

    function onMove(e: PointerEvent) {
      if (pointers.current.has(e.pointerId)) {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Pellizcar para alejar (ver el corazón), abrir para acercar.
      if (pinch.current.active && pointers.current.size === 2) {
        const current = dist();
        const change = current - pinch.current.startDist;
        if (Math.abs(change) > 40) {
          onMapViewChange(change < 0);
          pinch.current.startDist = current;
        }
        return;
      }

      const d = drag.current;
      // En el mapa el arrastre no mueve nada: la cámara la manda el modo.
      if (!d.active || mapView) return;
      const dy = e.clientY - d.startY;
      d.moved = Math.max(d.moved, Math.abs(dy));
      // Arrastrar hacia arriba avanza hacia el Día 11. Ojo con el signo: el
      // índice del recorrido CRECE con el día, así que el gesto va restado
      // (dy es negativo al subir el dedo).
      const next = d.startPos - dy * DRAG_PER_INDEX;
      pathPos.current = Math.min(days.length - 1, Math.max(0, next));
      onCenteredIndexChange(pathPosToIndex(pathPos.current, days.length));
    }

    function onUp(e: PointerEvent) {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) pinch.current.active = false;
      if (pointers.current.size === 0) drag.current.active = false;
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
  }, [gesturesEnabled, mapView, days.length, onCenteredIndexChange, onMapViewChange]);

  // Un "toque" solo cuenta si el dedo apenas se movió: deslizar por encima de
  // una estrella no debe abrir su día sin querer.
  const handleTapDay = useCallback(
    (id: number) => {
      if (drag.current.moved > 8) return;
      const index = days.findIndex((d) => d.id === id);
      if (index >= 0) {
        pathPos.current = index;
        onCenteredIndexChange(index);
      }
      onTapDay(id);
    },
    [days, onTapDay, onCenteredIndexChange],
  );

  return (
    <div className="fixed inset-0 touch-none">
      <Canvas
        // dpr capado a 2: en móviles de 3x el coste por píxel se dispara y se
        // nota en la batería sin ganancia visual real.
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 55, position: [0, 0, INTRO_DIST], near: 0.1, far: 200 }}
      >
        <Scene
          days={days}
          sphereStates={sphereStates}
          positions={positions}
          solvedProgress={solvedProgress}
          pulseTarget={pulseTarget}
          pathPos={pathPos}
          mapView={mapView}
          focusPosition={focusPosition}
          warping={warping}
          onTapDay={handleTapDay}
          onWarpComplete={onWarpComplete}
          onFocusArrived={onFocusArrived}
        />
      </Canvas>
    </div>
  );
}
