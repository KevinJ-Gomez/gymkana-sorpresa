"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DayComponentProps } from "@/types/gymkana";

const GRID_SIZE = 12;

function randomIndex(exclude?: number): number {
  let next = Math.floor(Math.random() * GRID_SIZE);
  while (next === exclude) next = Math.floor(Math.random() * GRID_SIZE);
  return next;
}

/** Día 10: minijuego — encuentra el corazón entre estrellas antes de que se mueva. */
export function Day10({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const [heartIndex, setHeartIndex] = useState(() => randomIndex());
  const [misses, setMisses] = useState(0);

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-3 text-center"
      >
        <h3 className="text-lg font-serif font-bold text-[#4a1d2e]">{config.rewardTitle}</h3>
        {config.physicalHint && (
          <p className="rounded-xl border border-dashed border-petal-300/60 bg-[#faf0f4] p-4 text-sm text-[#4a1d2e] leading-relaxed">
            {config.physicalHint}
          </p>
        )}
      </motion.div>
    );
  }

  function handleClick(index: number) {
    if (index === heartIndex) {
      onUnlock();
    } else {
      setMisses((m) => m + 1);
      setHeartIndex((current) => randomIndex(current));
    }
  }

  return (
    <div className="space-y-4">
      <p className="font-serif text-sm sm:text-base text-[#4a1d2e] leading-relaxed">{config.riddle}</p>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <motion.button
            key={index}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleClick(index)}
            className="flex aspect-square items-center justify-center rounded-xl border border-petal-200 bg-white text-xl shadow-xs transition hover:bg-[#faf0f4] active:scale-95"
          >
            {index === heartIndex ? "💖" : "✨"}
          </motion.button>
        ))}
      </div>
      {misses > 0 && (
        <p className="text-center text-xs font-mono text-[#9d5272]">Intentos fallidos: {misses}</p>
      )}
    </div>
  );
}

export default Day10;
