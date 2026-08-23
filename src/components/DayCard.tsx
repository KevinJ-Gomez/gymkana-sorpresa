"use client";

import { motion } from "framer-motion";
import { Lock, LockOpen, Sparkles } from "lucide-react";
import type { DayConfig } from "@/types/gymkana";
import { formatUnlockDate } from "@/lib/dates";

const ACCENTS = [
  "from-rose-400/70 to-orange-300/70",
  "from-fuchsia-400/70 to-purple-400/70",
  "from-sky-400/70 to-cyan-300/70",
  "from-amber-300/70 to-rose-300/70",
  "from-purple-400/70 to-indigo-400/70",
];

export function DayCard({
  config,
  isAvailable,
  isSolved,
  onSelect,
}: {
  config: DayConfig;
  isAvailable: boolean;
  isSolved: boolean;
  onSelect: () => void;
}) {
  const accent = ACCENTS[(config.id - 1) % ACCENTS.length];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={!isAvailable}
      whileHover={isAvailable ? { y: -4, scale: 1.02 } : undefined}
      whileTap={isAvailable ? { scale: 0.97 } : undefined}
      className={`group relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-3 text-center transition-shadow ${
        isAvailable
          ? "cursor-pointer border-white/20 bg-white/10 shadow-lg backdrop-blur-md hover:shadow-2xl"
          : "cursor-not-allowed border-white/10 bg-white/5 opacity-45"
      }`}
    >
      {isSolved && (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-30`}
        />
      )}

      <span className="relative text-3xl">{config.icon}</span>
      <span className="relative text-sm font-semibold text-white">Día {config.id}</span>

      <span className="relative flex items-center gap-1 text-[11px] text-white/70">
        {isSolved ? (
          <>
            <LockOpen className="h-3 w-3" /> Completado
          </>
        ) : isAvailable ? (
          <>
            <Sparkles className="h-3 w-3" /> Toca para abrir
          </>
        ) : (
          <>
            <Lock className="h-3 w-3" /> {formatUnlockDate(config.unlockDate)}
          </>
        )}
      </span>

      {config.giftLabel && isAvailable && (
        <span className="absolute right-1.5 top-1.5 rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-white/80">
          🎁
        </span>
      )}
    </motion.button>
  );
}
