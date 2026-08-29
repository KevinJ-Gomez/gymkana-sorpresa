"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Utensils, Sparkles } from "lucide-react";
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
      className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl"
    >
      {/* Luces difusas decorativas */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-pink-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-purple-500/20 blur-2xl" />

      <div className="relative z-10 flex flex-col items-center space-y-5">
        {/* Badge del premio */}
        <div className="flex items-center justify-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-300 backdrop-blur-md">
          <Utensils className="h-4 w-4" />
          <span>Te has ganado...</span>
          <Sparkles className="h-4 w-4" />
        </div>

        {/* Título del premio */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {config.rewardTitle || "Cena Romántica"}
        </h3>

        {/* Descripción del premio */}
        <p className="max-w-md text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
          {config.rewardDescription}
        </p>

        {/* Reproductor de Audio */}
        <div className="pt-2 w-full flex flex-col items-center gap-3">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-3 rounded-full px-6 py-3.5 font-medium text-white shadow-xl backdrop-blur-md transition-all active:scale-95 ${
              isPlaying
                ? "bg-pink-500 hover:bg-pink-600 ring-4 ring-pink-500/30"
                : "bg-white/20 hover:bg-white/30 border border-white/30"
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
                  className="w-1 rounded-full bg-pink-400"
                  style={{ height: "100%", transformOrigin: "bottom" }}
                />
              ))}
            </div>
          )}

          {hasAutoplayFailed && !isPlaying && (
            <p className="text-xs text-white/60">
              🎵 Toca el botón para escuchar la canción
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Day3;
