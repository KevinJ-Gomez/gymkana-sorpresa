"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, Sparkles } from "lucide-react";

const TARGET_UNLOCK = new Date("2026-10-02T00:00:00+02:00").getTime();
const TARGET_BIRTHDAY = new Date("2026-10-12T00:00:00+02:00").getTime();

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeDiff(target: number): TimeUnits {
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

interface LockedScreenProps {
  onSecretTap: () => void;
  toast: string | null;
}

export function LockedScreen({ onSecretTap, toast }: LockedScreenProps) {
  const [unlockTime, setUnlockTime] = useState<TimeUnits>(() => getTimeDiff(TARGET_UNLOCK));
  const [birthdayTime, setBirthdayTime] = useState<TimeUnits>(() => getTimeDiff(TARGET_BIRTHDAY));

  useEffect(() => {
    const interval = setInterval(() => {
      setUnlockTime(getTimeDiff(TARGET_UNLOCK));
      setBirthdayTime(getTimeDiff(TARGET_BIRTHDAY));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-y-auto overscroll-contain touch-pan-y bg-[#0b0620] px-4 py-6 text-center text-white select-none">
      {/* Toast para feedback del gesto secreto de desarrollador */}
      <AnimatePresence>
        {toast && (
          <motion.aside
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-6 z-50 rounded-full border border-pink-400/40 bg-black/85 px-5 py-2.5 text-xs font-semibold text-pink-200 shadow-2xl backdrop-blur-md"
          >
            {toast}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Luces de ambiente en el fondo */}
      <div className="pointer-events-none fixed -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-500/15 blur-[90px]" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-64 w-64 rounded-full bg-purple-600/15 blur-[90px]" />

      <div className="relative z-10 w-full max-w-xs space-y-4">
        {/* Candado */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-pink-300 shadow-inner backdrop-blur-md">
          <Lock className="h-7 w-7 text-pink-400 animate-pulse" />
        </div>

        {/* Título Bloqueada con el gesto secreto de 5 toques */}
        <div className="space-y-1">
          <h1
            onClick={onSecretTap}
            className="font-serif text-3xl font-bold tracking-tight text-white cursor-pointer select-none active:scale-95 transition"
          >
            Bloqueada
          </h1>
          <p className="text-xs sm:text-sm font-medium text-pink-200/80">
            Vuelve el día 2 de octubre
          </p>
        </div>

        {/* =============================================================== */}
        {/* CONTADOR 1: DESBLOQUEO DE LA PÁGINA (2 DE OCTUBRE)              */}
        {/* =============================================================== */}
        <div className="rounded-2xl border border-pink-500/25 bg-black/45 p-3 text-center shadow-lg backdrop-blur-md space-y-2">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-pink-300">
            <Sparkles className="h-3 w-3 text-pink-400" />
            <span>Desbloqueo de la web</span>
            <span className="text-[10px] text-pink-200/60 font-mono">· 2 OCT</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-lg font-bold text-white">{unlockTime.days}</span>
              <span className="text-[8px] uppercase text-pink-200/70">Días</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-lg font-bold text-white">
                {String(unlockTime.hours).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase text-pink-200/70">Horas</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-lg font-bold text-white">
                {String(unlockTime.minutes).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase text-pink-200/70">Min</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-pink-500/20 py-1.5 border border-pink-400/30">
              <span className="font-mono text-lg font-bold text-pink-400 animate-pulse">
                {String(unlockTime.seconds).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase text-pink-300">Seg</span>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* CONTADOR 2: DÍA DE SU CUMPLEAÑOS (12 DE OCTUBRE)                 */}
        {/* =============================================================== */}
        <div className="rounded-2xl border border-purple-500/25 bg-black/45 p-3 text-center shadow-lg backdrop-blur-md space-y-2">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-purple-300">
            <Heart className="h-3 w-3 fill-pink-400 text-pink-400" />
            <span>Tu cumpleaños</span>
            <span className="text-[10px] text-purple-200/60 font-mono">· 12 OCT</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-lg font-bold text-white">{birthdayTime.days}</span>
              <span className="text-[8px] uppercase text-purple-200/70">Días</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-lg font-bold text-white">
                {String(birthdayTime.hours).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase text-purple-200/70">Horas</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-lg font-bold text-white">
                {String(birthdayTime.minutes).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase text-purple-200/70">Min</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-purple-500/20 py-1.5 border border-purple-400/30">
              <span className="font-mono text-lg font-bold text-purple-300 animate-pulse">
                {String(birthdayTime.seconds).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase text-purple-300">Seg</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LockedScreen;
