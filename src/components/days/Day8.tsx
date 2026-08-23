"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Video } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

/** Día 8: mensaje al revés + placeholder de vídeo de ánimo de un amigo. */
export function Day8({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const decodedMessage = (config.cipherMessage ?? "").split("").reverse().join("");

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
        <p className="rounded-xl bg-white/5 p-4 italic text-white/90">{decodedMessage}</p>

        {config.videoSrc && !videoFailed ? (
          <video
            controls
            src={config.videoSrc}
            onError={() => setVideoFailed(true)}
            className="w-full rounded-xl"
          />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/30 bg-white/5 text-white/60">
            <Video className="h-8 w-8" />
            <p className="text-xs">
              Coloca el vídeo en <code className="rounded bg-black/30 px-1.5 py-0.5">public{config.videoSrc}</code>
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <p dir="rtl" className="rounded-xl bg-white/5 p-4 font-mono text-white/85">
        {config.cipherMessage}
      </p>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={onUnlock}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-fuchsia-500 px-5 py-3 font-medium text-white shadow-lg transition sm:hover:brightness-110"
      >
        <RotateCcw className="h-4 w-4" />
        Descifrar mensaje
      </motion.button>
    </div>
  );
}

export default Day8;
