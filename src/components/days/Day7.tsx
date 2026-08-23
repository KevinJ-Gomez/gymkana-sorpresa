"use client";

import { motion } from "framer-motion";
import type { DayComponentProps } from "@/types/gymkana";

/** Día 7: tras el acertijo de la comida favorita, animación CSS de flores creciendo. */
export function Day7({ config, isUnlocked }: DayComponentProps) {
  if (!isUnlocked) return null;

  const flowerCount = config.flowerCount ?? 5;

  return (
    <div className="space-y-4 text-center">
      <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
      {config.rewardDescription && (
        <p className="text-sm text-white/75">{config.rewardDescription}</p>
      )}

      <div className="flex h-40 items-end justify-center gap-3 rounded-2xl bg-gradient-to-t from-emerald-950/40 to-transparent px-4 pb-2">
        {Array.from({ length: flowerCount }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.4, ease: "backOut" }}
              className="text-2xl"
            >
              🌸
            </motion.span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 40 + (i % 3) * 12 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="w-1 rounded-full bg-emerald-400/70"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Day7;
