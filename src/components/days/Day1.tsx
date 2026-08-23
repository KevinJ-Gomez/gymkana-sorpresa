"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

/**
 * Día 1: acertijo del móvil como "aliado" del viaje.
 *
 * Antes este día se auto-desbloqueaba al montar (era la bienvenida sin clave).
 * Ahora tiene candado como cualquier otro, así que el reto lo gestiona el gate
 * de contraseña de DayContainer y aquí solo se pinta el premio.
 */
export function Day1({ config, isUnlocked }: DayComponentProps) {
  if (!isUnlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 text-center"
    >
      <Camera className="mx-auto h-9 w-9 text-fuchsia-300" />
      <h3 className="text-xl font-semibold text-white">{config.rewardTitle}</h3>
      {/* `whitespace-pre-line` respeta los saltos de línea del config, que es
          donde vive el texto con su separación entre el premio y la pista. */}
      <p className="mx-auto max-w-md whitespace-pre-line text-left leading-relaxed text-white/85">
        {config.rewardDescription}
      </p>
    </motion.div>
  );
}

export default Day1;
