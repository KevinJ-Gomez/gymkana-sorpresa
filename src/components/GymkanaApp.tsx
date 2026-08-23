"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import {
  DEFAULT_TESTING_MODE,
  GYMKANA_SUBTITLE,
  GYMKANA_TITLE,
  gymkanaConfig,
} from "@/config/gymkanaConfig";
import { useTestingMode, useUnlockedDays } from "@/lib/storage";
import { DayGrid } from "@/components/DayGrid";
import { DayContainer } from "@/components/DayContainer";

/**
 * Orquestador principal: alterna entre el grid de 11 días y el detalle de
 * un día concreto, y centraliza el estado de progreso + Modo Testing.
 *
 * Modo Testing: se activa con NEXT_PUBLIC_TESTING_MODE=true (.env.local) o
 * tocando 5 veces seguidas el título en menos de 2s (gesto oculto pensado
 * para probar en el propio dispositivo sin exponer un botón visible).
 */
export function GymkanaApp() {
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const { unlockedDays, markUnlocked } = useUnlockedDays();
  const { testingMode, setTestingMode } = useTestingMode(DEFAULT_TESTING_MODE);

  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const selectedDay = gymkanaConfig.find((day) => day.id === selectedDayId) ?? null;

  return (
    <div
      className="relative min-h-[100dvh] overflow-x-hidden bg-[radial-gradient(circle_at_20%_20%,#4c1d95,transparent_55%),radial-gradient(circle_at_80%_0%,#9d174d,transparent_45%),radial-gradient(circle_at_50%_100%,#1e1b4b,transparent_60%)] bg-slate-950
      pt-[max(1.75rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]
      pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]
      sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))]"
    >
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 text-center sm:mb-8">
          <button
            onClick={handleSecretTap}
            className="rounded-lg px-2 py-1 text-[1.75rem] leading-tight font-bold text-white drop-shadow-sm active:scale-[0.98] sm:text-4xl"
          >
            {GYMKANA_TITLE}
          </button>
          <p className="mt-2 text-sm text-white/70 sm:text-base">{GYMKANA_SUBTITLE}</p>

          {testingMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-4 flex max-w-[92%] flex-wrap items-center justify-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1.5 text-center text-xs font-medium text-amber-200 sm:max-w-none sm:flex-nowrap"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              Modo Testing activo — todos los días desbloqueados por fecha
            </motion.div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {selectedDay ? (
            <DayContainer
              key="day-detail"
              config={selectedDay}
              isUnlocked={unlockedDays.includes(selectedDay.id)}
              onUnlock={() => markUnlocked(selectedDay.id)}
              onBack={() => setSelectedDayId(null)}
            />
          ) : (
            <DayGrid
              key="day-grid"
              days={gymkanaConfig}
              unlockedDays={unlockedDays}
              testingMode={testingMode}
              onSelectDay={setSelectedDayId}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
