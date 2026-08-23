"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

/** Día 2: tras el acertijo del primer viaje, muestra una galería placeholder. */
export function Day2({ config, isUnlocked }: DayComponentProps) {
  if (!isUnlocked) return null;

  const captions = config.galleryCaptions ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
      {config.rewardDescription && (
        <p className="text-sm text-white/75">{config.rewardDescription}</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {captions.map((caption, index) => (
          <motion.div
            key={caption}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/25 bg-gradient-to-br from-white/10 to-white/0 p-3 text-center"
          >
            <ImageIcon className="h-6 w-6 text-white/50" />
            <span className="text-xs text-white/70">{caption}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-white/40">
        Sustituye este placeholder por vuestras fotos reales en /public.
      </p>
    </div>
  );
}

export default Day2;
