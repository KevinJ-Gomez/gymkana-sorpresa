"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Lock, RotateCcw, Sparkles } from "lucide-react";
import {
  DEFAULT_TESTING_MODE,
  GYMKANA_SUBTITLE,
  GYMKANA_TITLE,
  gymkanaConfig,
} from "@/config/gymkanaConfig";
import { formatUnlockDate, isDateReached } from "@/lib/dates";
import { useIntroSeen, useTestingMode, useUnlockedDays } from "@/lib/storage";
import { IntroSequence } from "@/components/IntroSequence";
import { DayContainer } from "@/components/DayContainer";
import type { SphereState } from "@/components/three/NebulaScene";

// El 3D se carga solo en cliente: evita cualquier problema de SSR/hidratación
// y mantiene three.js fuera del primer HTML.
const NebulaScene = dynamic(
  () => import("@/components/three/NebulaScene").then((m) => m.NebulaScene),
  { ssr: false },
);

/**
 * Orquestador de las tres fases narrativas:
 *   1. Intro cinemática  →  2. Nebulosa + constelación  →  3. Tarjeta del día
 *
 * Modo Testing: NEXT_PUBLIC_TESTING_MODE=true (.env.local) o tocando 5 veces
 * seguidas el título (gesto oculto, sin botón visible para la sorprendida).
 */
export function GymkanaApp() {
  const { unlockedDays, markUnlocked } = useUnlockedDays();
  const { testingMode, setTestingMode } = useTestingMode(DEFAULT_TESTING_MODE);
  const { introSeen, setIntroSeen } = useIntroSeen();

  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [centeredIndex, setCenteredIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hudPointerStartY = useRef<number | null>(null);

  /** El día "de hoy" se calcula siempre con la fecha real, aunque el Modo
   *  Testing haya abierto el resto: la estrella rosa debe decir la verdad. */
  const todayId = useMemo(() => {
    const reached = gymkanaConfig.filter((day) => isDateReached(day.unlockDate));
    return reached.length > 0 ? reached[reached.length - 1].id : null;
  }, []);

  const sphereStates = useMemo<SphereState[]>(
    () =>
      gymkanaConfig.map((day) => {
        if (unlockedDays.includes(day.id)) return "solved";
        if (day.id === todayId) return "today";
        if (testingMode || isDateReached(day.unlockDate)) return "available";
        return "locked";
      }),
    [unlockedDays, todayId, testingMode],
  );

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function handleSecretTap() {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000);

    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setTestingMode(!testingMode);
    }
  }

  const handleTapDay = useCallback(
    (id: number) => {
      const day = gymkanaConfig.find((d) => d.id === id);
      if (!day) return;
      if (!testingMode && !isDateReached(day.unlockDate)) {
        showToast(`Esta estrella se enciende el ${formatUnlockDate(day.unlockDate)}`);
        return;
      }
      setSelectedDayId(id);
    },
    [testingMode],
  );

  const handleFocusArrived = useCallback(() => setCardOpen(true), []);

  const handleClose = useCallback(() => {
    setCardOpen(false);
    setSelectedDayId(null);
  }, []);

  const selectedDay = gymkanaConfig.find((day) => day.id === selectedDayId) ?? null;
  const centeredDay = gymkanaConfig[centeredIndex];
  const centeredState = sphereStates[centeredIndex];
  const showIntro = !introSeen;
  const hudVisible = !showIntro && !selectedDayId;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#0b0620]">
      <NebulaScene
        days={gymkanaConfig}
        sphereStates={sphereStates}
        focusedDayId={selectedDayId}
        introMode={showIntro}
        onTapDay={handleTapDay}
        onFocusArrived={handleFocusArrived}
        onCenteredIndexChange={setCenteredIndex}
      />

      {/* ---------------------------------------------------------------- */}
      {/* HUD sobre el canvas. pointer-events-none para que el swipe llegue  */}
      {/* al 3D; solo los controles reales capturan el toque.               */}
      {/* ---------------------------------------------------------------- */}
      <AnimatePresence>
        {hudVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between
              pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            {/* Cabecera */}
            <header className="px-6 text-center">
              <button
                onClick={handleSecretTap}
                className="pointer-events-auto rounded-lg px-3 py-1 text-2xl font-bold text-white
                  drop-shadow-[0_2px_18px_rgba(236,72,153,0.5)] active:scale-[0.98]"
              >
                {GYMKANA_TITLE}
              </button>
              <p className="mt-1 text-sm text-white/60">{GYMKANA_SUBTITLE}</p>

              {testingMode && (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20
                      px-3 py-1.5 text-xs font-medium text-amber-200"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    Modo Testing activo
                  </span>
                  <button
                    onClick={() => setIntroSeen(false)}
                    className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full
                      bg-white/10 px-3 py-1.5 text-xs text-white/70 active:bg-white/20"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Ver la intro otra vez
                  </button>
                </div>
              )}
            </header>

            {/* Indicador del día centrado */}
            <div className="space-y-3 px-6">
              <AnimatePresence>
                {toast && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mx-auto w-fit rounded-full border border-white/15 bg-black/50
                      px-4 py-2 text-center text-xs text-white/80 backdrop-blur-md"
                  >
                    {toast}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Además de tocar la esfera en 3D, esta tarjeta abre el día
                  centrado: un objetivo grande y fijo para el pulgar, mucho más
                  fiable que acertar a una esfera pequeña en perspectiva. */}
              <motion.button
                key={centeredDay.id}
                type="button"
                // El pulgar suele empezar el swipe justo sobre esta tarjeta:
                // si el dedo se ha movido, era un gesto de scroll, no un tap.
                onPointerDown={(e) => {
                  hudPointerStartY.current = e.clientY;
                }}
                onClick={(e) => {
                  const startY = hudPointerStartY.current;
                  if (startY !== null && Math.abs(e.clientY - startY) > 8) return;
                  handleTapDay(centeredDay.id);
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-auto mx-auto block w-full max-w-sm rounded-2xl
                  border border-white/15 bg-white/[0.07] px-5 py-4 text-center backdrop-blur-md"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-fuchsia-200/70">
                  Día {centeredDay.id} · {formatUnlockDate(centeredDay.unlockDate)}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {centeredState === "locked" ? "Estrella apagada" : centeredDay.title}
                </p>
                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-white/55">
                  {centeredState === "locked" ? (
                    <>
                      <Lock className="h-3 w-3" /> Aún no disponible
                    </>
                  ) : centeredState === "solved" ? (
                    <>
                      <Sparkles className="h-3 w-3 text-amber-300" /> Completado
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 text-fuchsia-300" /> Toca para abrir
                    </>
                  )}
                </p>
              </motion.button>

              <p className="text-center text-[11px] text-white/35">
                Desliza arriba y abajo para recorrer la constelación
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro cinemática */}
      <AnimatePresence>
        {showIntro && <IntroSequence key="intro" onStart={() => setIntroSeen(true)} />}
      </AnimatePresence>

      {/* Tarjeta del día: solo cuando la cámara ha terminado el zoom */}
      <AnimatePresence>
        {cardOpen && selectedDay && (
          <DayContainer
            key={selectedDay.id}
            config={selectedDay}
            isUnlocked={unlockedDays.includes(selectedDay.id)}
            onUnlock={() => markUnlocked(selectedDay.id)}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* La app está diseñada solo para vertical. */}
      <div
        className="pointer-events-none fixed inset-0 z-40 hidden items-center justify-center
          bg-[#0b0620] px-10 text-center
          [@media(orientation:landscape)_and_(max-height:520px)]:flex"
      >
        <p className="text-lg font-medium text-white/80">
          Gira el móvil en vertical 📱
          <span className="mt-2 block text-sm text-white/50">
            Esta gymkana está hecha para verse en vertical.
          </span>
        </p>
      </div>
    </main>
  );
}
