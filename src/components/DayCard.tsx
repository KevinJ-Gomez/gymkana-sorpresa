"use client";

import { useState } from "react";
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

/** true solo en dispositivos con puntero real (ratón/trackpad): evita que el
 * "lift" de whileHover se quede pegado tras un tap en móvil/táctil. */
function useCanHover() {
  const [canHover] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches,
  );
  return canHover;
}

export function DayCard({
  config,
  isAvailable,
  isSolved,
  featured = false,
  onSelect,
}: {
  config: DayConfig;
  isAvailable: boolean;
  isSolved: boolean;
  featured?: boolean;
  onSelect: () => void;
}) {
  const accent = ACCENTS[(config.id - 1) % ACCENTS.length];
  const canHover = useCanHover();

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={!isAvailable}
      whileHover={isAvailable && canHover ? { y: -4, scale: 1.02 } : undefined}
      whileTap={isAvailable ? { scale: 0.96 } : undefined}
      className={`group relative flex w-full flex-row items-center justify-center gap-3 overflow-hidden rounded-2xl border p-4 text-center transition-shadow sm:aspect-square sm:flex-col sm:justify-center sm:gap-2 ${
        featured ? "aspect-[2.4/1]" : "aspect-square"
      } ${
        isAvailable
          ? `cursor-pointer border-white/20 shadow-lg backdrop-blur-md active:shadow-md ${
              canHover ? "hover:shadow-2xl" : ""
            } ${featured ? "bg-gradient-to-br from-rose-500/25 via-fuchsia-500/15 to-amber-400/20" : "bg-white/10"}`
          : "cursor-not-allowed border-white/10 bg-white/5 opacity-45"
      }`}
    >
      {isSolved && (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-30`}
        />
      )}

      <span className={`relative shrink-0 ${featured ? "text-4xl sm:text-4xl" : "text-4xl"}`}>
        {config.icon}
      </span>

      <span className="relative flex flex-col items-start gap-0.5 sm:items-center">
        <span className="text-base font-semibold text-white sm:text-sm">Día {config.id}</span>

        <span className="flex items-center gap-1 text-xs text-white/70 sm:text-[11px]">
          {isSolved ? (
            <>
              <LockOpen className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" /> Completado
            </>
          ) : isAvailable ? (
            <>
              <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" /> Toca para abrir
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" /> {formatUnlockDate(config.unlockDate)}
            </>
          )}
        </span>
      </span>

      {config.giftLabel && isAvailable && (
        <span className="absolute right-2 top-2 rounded-full bg-black/30 px-2 py-0.5 text-xs sm:text-[10px]">
          🎁
        </span>
      )}
    </motion.button>
  );
}
