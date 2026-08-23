"use client";

import { motion } from "framer-motion";
import type { DayComponentProps } from "@/types/gymkana";

/** Día 3: pista con emojis para adivinar la canción; premio = audio + carta. */
export function Day3({ config, isUnlocked }: DayComponentProps) {
  if (!isUnlocked) {
    return (
      <p className="rounded-xl bg-white/5 py-6 text-center text-4xl tracking-widest">
        {config.emojiClue}
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>

      {config.songFile && (
        <audio controls className="w-full rounded-lg" src={config.songFile}>
          Tu navegador no soporta audio.
        </audio>
      )}

      {config.letterText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="rounded-xl bg-white/5 p-4 font-serif text-base italic leading-relaxed text-white/90"
        >
          “{config.letterText}”
        </motion.p>
      )}
    </motion.div>
  );
}

export default Day3;
