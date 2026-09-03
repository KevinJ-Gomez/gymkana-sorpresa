"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Lock, RotateCcw, Heart, ZoomIn, ZoomOut } from "lucide-react";
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
import { TouchParticleTrail } from "@/components/effects/TouchParticleTrail";
import { GiftUnboxModal } from "@/components/effects/GiftUnboxModal";
import { CountdownTimer } from "@/components/hud/CountdownTimer";
import { DailyPlanDrawer } from "@/components/common/DailyPlanDrawer";
import { hapticTap, hapticSuccess } from "@/lib/haptics";
import type { DayConfig } from "@/types/gymkana";
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
  const { unlockedDays, markUnlocked, relockDay, resetUnlockedDays } = useUnlockedDays();
  const { testingMode, setTestingMode } = useTestingMode(DEFAULT_TESTING_MODE);
  const { introSeen, setIntroSeen } = useIntroSeen();

  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [centeredIndex, setCenteredIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  /** Vista alejada: se ve el corazón entero en vez de viajar de estrella a estrella. */
  const [mapView, setMapView] = useState(false);
  /** Salto a hiperespacio en curso (solo la primera vez, tras la intro). */
  const [warping, setWarping] = useState(false);
  /** Día que se está desenvolviendo con la caja de regalo */
  const [unboxingDay, setUnboxingDay] = useState<DayConfig | null>(null);
  /** Estado del cajón del Planning del día */
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);

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
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  /**
   * Gesto oculto: 5 toques en el título en menos de 2 s activan/desactivan el
   * Modo Testing en el dispositivo de la sorprendida sin dejar botones visibles.
   */
  function handleSecretTap() {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000);

    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setTestingMode(!testingMode);
      showToast(
        testingMode ? "Modo Testing desactivado" : "¡Modo Testing activado!",
      );
    }
  }

  const handleTapDay = useCallback(
    (id: number) => {
      hapticTap();
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

  /** Arranca el salto; la intro se retira y manda la escena 3D. */
  const handleStartJourney = useCallback(() => {
    hapticTap();
    setWarping(true);
    setIntroSeen(true);
  }, [setIntroSeen]);

  const handleWarpComplete = useCallback(() => setWarping(false), []);

  const selectedDay = gymkanaConfig.find((day) => day.id === selectedDayId) ?? null;
  const centeredDay = gymkanaConfig[centeredIndex];
  const centeredState = sphereStates[centeredIndex];
  const showIntro = !introSeen;
  const hudVisible = !showIntro && !warping && !selectedDayId;

  /** Días resueltos seguidos desde el principio: es lo que ilumina la curva. */
  const solvedCount = useMemo(() => {
    let n = 0;
    for (const day of gymkanaConfig) {
      if (!unlockedDays.includes(day.id)) break;
      n++;
    }
    return n;
  }, [unlockedDays]);

  const todayIndex = todayId
    ? gymkanaConfig.findIndex((d) => d.id === todayId)
    : 0;

  // Día activo del calendario (el de hoy según fecha o el último desbloqueado en testing)
  const currentActiveDayId =
    todayId ??
    (testingMode && unlockedDays.length > 0 ? Math.max(...unlockedDays) : null);

  // Fase 1: El cajón solo aparece si el día actual ya ha sido desbloqueado con su reto
  const isTodayUnlocked =
    currentActiveDayId !== null && unlockedDays.includes(currentActiveDayId);
  const showPlanDrawer = isTodayUnlocked && hudVisible;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#07031a]">
      {/* Estela mágica táctil de chispas en pantalla */}
      <TouchParticleTrail />

      <NebulaScene
        days={gymkanaConfig}
        sphereStates={sphereStates}
        solvedCount={solvedCount}
        todayIndex={todayIndex}
        focusedDayId={selectedDayId}
        mapView={mapView}
        warping={warping}
        onTapDay={handleTapDay}
        onFocusArrived={handleFocusArrived}
        onWarpComplete={handleWarpComplete}
        onCenteredIndexChange={setCenteredIndex}
        onMapViewChange={setMapView}
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
              <p className="mt-0.5 text-xs sm:text-sm text-white/60">{GYMKANA_SUBTITLE}</p>

              {/* Reloj Cuenta Atrás Estelar para el 30 Cumpleaños */}
              <div className="mt-2.5 flex justify-center pointer-events-auto">
                <CountdownTimer />
              </div>

              {testingMode && (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20
                      px-3 py-1.5 text-xs font-medium text-amber-200"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    Modo Testing activo
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        resetUnlockedDays();
                        showToast("¡Todos los retos se han bloqueado!");
                      }}
                      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full
                        bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-xs font-medium text-rose-200 active:bg-rose-500/30 shadow-md"
                    >
                      <Lock className="h-3 w-3" />
                      Bloquear todos los retos
                    </button>
                    <button
                      onClick={() => setIntroSeen(false)}
                      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full
                        bg-white/10 px-3 py-1.5 text-xs text-white/70 active:bg-white/20"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Ver intro otra vez
                    </button>
                  </div>
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

              {/* Tarjeta de acción rápida centrada para abrir el día */}
              <motion.button
                key={centeredDay.id}
                type="button"
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
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-pink-200/70">
                  Día {centeredDay.id} · {formatUnlockDate(centeredDay.unlockDate)}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {centeredState === "locked" ? "Estrella apagada" : centeredDay.title}
                </p>
                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-white/70">
                  {centeredState === "locked" ? (
                    <>
                      <Lock className="h-3 w-3" /> Aún no disponible
                    </>
                  ) : centeredState === "solved" ? (
                    <>
                      <Heart className="h-3 w-3 fill-amber-300 text-amber-300" /> Completado
                    </>
                  ) : (
                    <>
                      <Heart className="h-3 w-3 fill-pink-400 text-pink-400" /> Toca para abrir
                    </>
                  )}
                </p>
              </motion.button>

              <p className="text-center text-[11px] text-white/35">
                {mapView
                  ? "Toca una estrella para abrir su día"
                  : "Desliza para recorrer · pellizca para ver el corazón"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alejar/acercar botón */}
      <AnimatePresence>
        {hudVisible && (
          <motion.button
            key="map-toggle"
            type="button"
            onClick={() => setMapView(!mapView)}
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            aria-label={mapView ? "Acercar a la constelación" : "Ver el corazón entero"}
            className="fixed right-5 z-20 flex h-12 w-12 items-center justify-center
              rounded-full border border-white/20 bg-black/40 text-white/90 shadow-xl backdrop-blur-lg transition-all hover:bg-black/60 active:scale-95
              bottom-[13.5rem] sm:bottom-[13rem]"
          >
            {mapView ? <ZoomIn className="h-5 w-5" /> : <ZoomOut className="h-5 w-5" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Intro cinemática */}
      <AnimatePresence>
        {showIntro && <IntroSequence key="intro" onStart={handleStartJourney} />}
      </AnimatePresence>

      {/* Tarjeta del día */}
      <AnimatePresence>
        {cardOpen && selectedDay && (
          <DayContainer
            key={selectedDay.id}
            config={selectedDay}
            isUnlocked={unlockedDays.includes(selectedDay.id)}
            testingMode={testingMode}
            onUnlock={() => {
              markUnlocked(selectedDay.id);
              setUnboxingDay(selectedDay);
              hapticSuccess();
            }}
            onRelock={() => relockDay(selectedDay.id)}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Modal festivo de apertura de caja de regalo con confeti */}
      <GiftUnboxModal
        isOpen={!!unboxingDay}
        giftTitle={unboxingDay?.giftLabel}
        onOpened={() => setUnboxingDay(null)}
      />

      {/* Cajón Planning del día (Solo visible si el día actual está desbloqueado) */}
      <AnimatePresence>
        {showPlanDrawer && currentActiveDayId && (
          <DailyPlanDrawer
            isOpen={isPlanDrawerOpen}
            onToggle={() => setIsPlanDrawerOpen((prev) => !prev)}
            onClose={() => setIsPlanDrawerOpen(false)}
            days={gymkanaConfig}
            unlockedDays={unlockedDays}
            activeDayId={currentActiveDayId}
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

export default GymkanaApp;
