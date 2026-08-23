"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Día 6: puzzle simplificado — pulsa las piezas en orden ascendente (1..N). */
export function Day6({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const pieceCount = config.puzzlePieces ?? 6;
  const [tiles] = useState(() => shuffle(Array.from({ length: pieceCount }, (_, i) => i + 1)));
  const [nextExpected, setNextExpected] = useState(1);
  const [wrongTile, setWrongTile] = useState<number | null>(null);

  const solved = useMemo(() => nextExpected > pieceCount, [nextExpected, pieceCount]);

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-3 text-center"
      >
        <MapPin className="mx-auto h-8 w-8 text-emerald-300" />
        <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
        {config.excursionHint && (
          <p className="rounded-xl border border-dashed border-white/30 bg-white/5 p-4 text-white/90">
            {config.excursionHint}
          </p>
        )}
      </motion.div>
    );
  }

  function handleTileClick(tile: number) {
    if (tile === nextExpected) {
      const next = nextExpected + 1;
      setNextExpected(next);
      if (next > pieceCount) onUnlock();
    } else {
      setWrongTile(tile);
      setTimeout(() => setWrongTile(null), 300);
      setNextExpected(1);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-white/85">{config.riddle}</p>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => {
          const isDone = tile < nextExpected;
          return (
            <motion.button
              key={tile}
              type="button"
              onClick={() => handleTileClick(tile)}
              disabled={isDone || solved}
              whileTap={isDone || solved ? undefined : { scale: 0.94 }}
              animate={wrongTile === tile ? { x: [0, -6, 6, -6, 0] } : {}}
              className={`flex aspect-square items-center justify-center rounded-xl border text-xl font-semibold transition ${
                isDone
                  ? "border-emerald-300/60 bg-emerald-400/20 text-emerald-200"
                  : "border-white/20 bg-white/10 text-white active:bg-white/20 sm:hover:bg-white/20"
              }`}
            >
              {tile}
            </motion.button>
          );
        })}
      </div>
      <p className="text-center text-xs text-white/50">
        Progreso: {Math.min(nextExpected - 1, pieceCount)} / {pieceCount}
      </p>
    </div>
  );
}

export default Day6;
