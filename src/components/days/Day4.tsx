"use client";

import { motion } from "framer-motion";
import type { DayComponentProps } from "@/types/gymkana";
import { GiftImageReveal } from "@/components/ui/GiftImageReveal";

/**
 * Día 4 — plantilla base "regalo con imagen sorpresa".
 * El acertijo/contraseña ya lo gestiona DayContainer; este componente solo
 * pinta la recompensa una vez `isUnlocked` es true. El mismo patrón se
 * reutiliza en Day9.tsx para el bolso.
 */
export function Day4({ config, isUnlocked }: DayComponentProps) {
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

export default Day4;
