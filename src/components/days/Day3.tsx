"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Utensils, Heart } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

/**
 * Día 3: Adivina la canción mediante emojis.
 * Al acertar, se reproduce automáticamente /audio/piedra.mp3 (con fallback de botón)
 * y se revela el premio de la cena romántica en una tarjeta Glassmorphism.
 */
export function Day3({ config, isUnlocked }: DayComponentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoplayFailed, setHasAutoplayFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isUnlocked) return;

    const audio = new Audio("/audio/piedra.mp3");
    audio.preload = "auto";
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    // Intentar reproducción automática (puede requerir interacción en navegadores móviles)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasAutoplayFailed(false);
        })
        .catch(() => {
          // Autoplay bloqueado por políticas del navegador
          setIsPlaying(false);
          setHasAutoplayFailed(true);
        });
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [isUnlocked]);

  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/piedra.mp3");
      audio.preload = "auto";
      audioRef.current = audio;
      audio.addEventListener("ended", () => setIsPlaying(false));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("play", () => setIsPlaying(true));
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasAutoplayFailed(false);
        })
        .catch((err) => {
          console.error("Error al reproducir audio:", err);
        });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-3xl sm:text-4xl tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          🚶‍♂️💥🪨 🔄 🎶
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-petal-300/40 bg-[#faf0f4] p-6 sm:p-8 text-center shadow-lg"
    >
      <div className="relative z-10 flex flex-col items-center space-y-5">
        {/* Badge del premio */}
        <div className="flex items-center justify-center gap-2 rounded-full border border-petal-300/60 bg-[#fce7f3] px-4 py-1.5 text-xs font-serif font-semibold uppercase tracking-wider text-[#be185d] shadow-xs">
          <Heart className="h-4 w-4 fill-[#be185d] text-[#be185d]" />
          <span>Te has ganado...</span>
          <Heart className="h-4 w-4 fill-[#be185d] text-[#be185d]" />
        </div>

        {/* Título del premio */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1d2e]">
          {config.rewardTitle || "Cena Romántica"}
        </h3>

        {/* Descripción del premio */}
        <p className="max-w-md font-serif text-sm sm:text-base leading-relaxed text-[#4a1d2e]">
          {config.rewardDescription}
        </p>

        {/* Reproductor de Audio */}
        <div className="pt-2 w-full flex flex-col items-center gap-3">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-3 rounded-full px-6 py-3.5 font-medium text-white shadow-xl transition-all active:scale-95 ${
              isPlaying
                ? "bg-gradient-to-r from-petal-600 via-petal-700 to-petal-800 ring-4 ring-petal-400/30"
                : "bg-gradient-to-r from-petal-500 via-petal-600 to-petal-700"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 fill-white" />
                <span>Pausar canción</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white ml-0.5" />
                <span>Reproducir canción</span>
              </>
            )}
          </button>

          {/* Animación de ondas musicales */}
          {isPlaying && (
            <div className="flex items-center gap-1.5 h-6">
              {[0.4, 0.8, 0.5, 0.9, 0.6, 0.7, 0.4].map((h, i) => (
                <motion.span
                  key={i}
                  animate={{
                    scaleY: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 rounded-full bg-[#be185d]"
                  style={{ height: "100%", transformOrigin: "bottom" }}
                />
              ))}
            </div>
          )}

          {hasAutoplayFailed && !isPlaying && (
            <p className="text-xs font-serif text-[#9d5272]">
              🎵 Toca el botón para escuchar la canción
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Day3;
