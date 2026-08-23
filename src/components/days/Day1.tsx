"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { DayComponentProps } from "@/types/gymkana";

/** Día 1: sin contraseña, solo mensaje de bienvenida. Se marca como visto al montar. */
export function Day1({ config, isUnlocked, onUnlock }: DayComponentProps) {
  useEffect(() => {
    if (!isUnlocked) onUnlock();
  }, [isUnlocked, onUnlock]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 text-center"
    >
      <p className="text-4xl">💌</p>
      <h3 className="text-xl font-semibold text-white">{config.rewardTitle}</h3>
      <p className="mx-auto max-w-md leading-relaxed text-white/85">
        {config.rewardDescription}
      </p>
    </motion.div>
  );
}

export default Day1;
