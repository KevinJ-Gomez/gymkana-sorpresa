"use client";

import { motion } from "framer-motion";
import type { DayComponentProps } from "@/types/gymkana";
import { GiftImageReveal } from "@/components/ui/GiftImageReveal";

/** Día 9 — mismo patrón que Day4.tsx (imagen sorpresa), esta vez para el bolso. */
export function Day9({ config, isUnlocked }: DayComponentProps) {
  if (!isUnlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4 text-center"
    >
      <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
      {config.rewardDescription && (
        <p className="text-sm text-white/75">{config.rewardDescription}</p>
      )}

      {config.imageSrc && (
        <GiftImageReveal
          src={config.imageSrc}
          alt={config.rewardTitle}
          caption={config.imageCaption}
        />
      )}
    </motion.div>
  );
}

export default Day9;
