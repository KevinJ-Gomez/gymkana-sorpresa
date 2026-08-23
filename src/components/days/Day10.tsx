"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
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
        <MapPinned className="mx-auto h-8 w-8 text-rose-300" />
        <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
        {config.physicalHint && (
          <p className="rounded-xl border border-dashed border-white/30 bg-white/5 p-4 text-white/90">
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
      <p className="text-white/85">{config.riddle}</p>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <motion.button
            key={index}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleClick(index)}
            className="flex aspect-square items-center justify-center rounded-xl border border-white/15 bg-white/5 text-xl transition active:bg-white/15 sm:hover:bg-white/15"
          >
            {index === heartIndex ? "💖" : "✨"}
          </motion.button>
        ))}
      </div>
      {misses > 0 && (
        <p className="text-center text-xs text-white/50">Intentos fallidos: {misses}</p>
      )}
    </div>
  );
}

export default Day10;
