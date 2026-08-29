"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, X, Flower2, BookOpen, ChevronRight, Check } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

interface FlowerNode {
  id: number;
  x: number; // Porcentaje horizontal exacto sobre la flor en la foto
  y: number; // Porcentaje vertical exacto
  name: string;
  emoji: string;
  colorGrad: string;
  glowColor: string;
  text: string;
}

// Las 13 posiciones exactas mapeadas sobre cada flor real del ramo
const BOUQUET_FLOWERS: FlowerNode[] = [
  {
    id: 1,
    x: 62,
    y: 26,
    name: "Orquídea de Luz",
    emoji: "✨",
    colorGrad: "from-pink-400 via-fuchsia-400 to-purple-500",
    glowColor: "rgba(232, 121, 249, 0.85)",
    text: "Amo todos los besos que me das a diario y todas las veces que me pides que te dé más.",
  },
  {
    id: 2,
    x: 73,
    y: 25,
    name: "Orquídea Cristal",
    emoji: "🌸",
    colorGrad: "from-fuchsia-400 via-pink-400 to-rose-500",
    glowColor: "rgba(244, 114, 182, 0.85)",
    text: "Amo cuidarte, mimarte y consentirte cada vez que puedo.",
  },
  {
    id: 3,
    x: 59,
    y: 31,
    name: "Orquídea Celestial",
    emoji: "🌺",
    colorGrad: "from-violet-400 via-purple-500 to-pink-500",
    glowColor: "rgba(192, 132, 252, 0.85)",
    text: "Amo que tú también me cuides y me mimes cuando puedes.",
  },
  {
    id: 4,
    x: 69,
    y: 30,
    name: "Orquídea Radiante",
    emoji: "💫",
    colorGrad: "from-purple-400 via-fuchsia-500 to-pink-600",
    glowColor: "rgba(217, 70, 239, 0.85)",
    text: "Amo la buena persona que eres y que me haces ser.",
  },
  {
    id: 5,
    x: 29,
    y: 30,
    name: "Rosa Roja de Pasión",
    emoji: "🌹",
    colorGrad: "from-rose-500 via-red-600 to-pink-600",
    glowColor: "rgba(244, 63, 94, 0.9)",
    text: "Amo cada comida que me preparas con esfuerzo y amor.",
  },
  {
    id: 6,
    x: 41,
    y: 31,
    name: "Rosa Terciopelo",
    emoji: "👑",
    colorGrad: "from-red-500 via-rose-600 to-pink-700",
    glowColor: "rgba(225, 29, 72, 0.9)",
    text: "Amo lo orgulloso que me haces sentir de tenerte y lo bien que me siento al hablar de ti.",
  },
  {
    id: 7,
    x: 49,
    y: 28,
    name: "Rosa Carmesí",
    emoji: "💬",
    colorGrad: "from-red-600 via-rose-600 to-amber-600",
    glowColor: "rgba(239, 68, 68, 0.9)",
    text: "Amo lo bien que hablas de mí a otros.",
  },
  {
    id: 8,
    x: 39,
    y: 37,
    name: "Rosa Espiral",
    emoji: "🤝",
    colorGrad: "from-rose-500 via-red-600 to-purple-600",
    glowColor: "rgba(244, 63, 94, 0.9)",
    text: "Amo la forma en que me respetas a mí y cuidas nuestra relación.",
  },
  {
    id: 9,
    x: 30,
    y: 43,
    name: "Rosa de Amor",
    emoji: "🎁",
    colorGrad: "from-pink-500 via-rose-500 to-red-600",
    glowColor: "rgba(236, 72, 153, 0.9)",
    text: "Amo cada vez que te acuerdas de mí y tienes detalles conmigo.",
  },
  {
    id: 10,
    x: 38,
    y: 47,
    name: "Rosa Eterna",
    emoji: "💍",
    colorGrad: "from-rose-500 via-pink-500 to-amber-400",
    glowColor: "rgba(251, 113, 133, 0.9)",
    text: "Amo a mi futura mujer.",
  },
  {
    id: 11,
    x: 47,
    y: 50,
    name: "Rosa Rubí",
    emoji: "👨‍👩‍👧",
    colorGrad: "from-red-500 via-rose-500 to-fuchsia-600",
    glowColor: "rgba(244, 63, 94, 0.9)",
    text: "Amo la forma en la que cuidas a tu familia y sobre todo a tu hermano.",
  },
  {
    id: 12,
    x: 51,
    y: 38,
    name: "Peonía Blush",
    emoji: "🔥",
    colorGrad: "from-pink-300 via-rose-400 to-pink-500",
    glowColor: "rgba(244, 114, 182, 0.85)",
    text: "Amo cada parte de tu cuerpo.",
  },
  {
    id: 13,
    x: 60,
    y: 43,
    name: "Gran Peonía Imperial",
    emoji: "🍑",
    colorGrad: "from-pink-400 via-rose-500 to-amber-500",
    glowColor: "rgba(251, 146, 60, 0.95)",
    text: "Amo darte cachetes en el culo y otras cosas... cuando te agachas.",
  },
];

/**
 * Día 7: Ramo Ficticio Espectacular con Foto Artística Hiperrealista + Puntos Interactivos Táctiles
 */
export function Day7({ isUnlocked }: DayComponentProps) {
  const [hasStartedBouquet, setHasStartedBouquet] = useState(false);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [activeFlower, setActiveFlower] = useState<FlowerNode | null>(null);
  const [showFullLetter, setShowFullLetter] = useState(false);

  if (!isUnlocked) return null;

  const handleOpenFlower = (flower: FlowerNode) => {
    setActiveFlower(flower);
    if (!revealedIds.includes(flower.id)) {
      setRevealedIds((prev) => [...prev, flower.id]);
    }
  };

  const isAllRevealed = revealedIds.length === BOUQUET_FLOWERS.length;
  const progressPercent = (revealedIds.length / BOUQUET_FLOWERS.length) * 100;

  // ==========================================
  // FASE 1: MENSAJE INTRODUCTORIO
  // ==========================================
  if (!hasStartedBouquet) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#2d1138] via-[#1a0c28] to-[#10051d] p-7 text-center shadow-2xl backdrop-blur-xl space-y-6"
      >
        {/* Glows florales */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-300 backdrop-blur-md">
            <Flower2 className="h-4 w-4" />
            <span>Un Regalo Especial</span>
            <Sparkles className="h-4 w-4" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Lo que más amo de ti
          </h3>

          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-5 text-left space-y-3">
            <p className="text-sm sm:text-base leading-relaxed text-white/95 font-serif italic">
              “Hoy no hay un regalo físico... pero te he preparado un ramo con las cosas que más me gustan de ti:”
            </p>
            <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed">
              Un <strong>ramo espectacular e infinito</strong> que guarda 13 flores mágicas. Toca cada flor para abrir sus pétalos y descubrir qué hace que te ame tanto cada día.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => setHasStartedBouquet(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-6 py-4 font-semibold text-white shadow-2xl transition hover:brightness-110 flex items-center justify-center gap-2 text-base"
          >
            <span>Descubrir nuestro ramo</span>
            <Sparkles className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // FASE 2: EL RAMO ESPECTACULAR CON PUNTOS INTERACTIVOS
  // ==========================================
  return (
    <div className="relative flex flex-col items-center space-y-4 text-center">
      {/* Barra de progreso superior */}
      <div className="w-full max-w-sm space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-pink-300 px-1">
          <span>Flores abiertas: {revealedIds.length} / 13</span>
          <span>{isAllRevealed ? "¡Ramo en esplendor! ✨" : "Toca las flores brillantes"}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* LIENZO DEL RAMO HIPERREALISTA CON ILUMINACIÓN DINÁMICA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[360px] aspect-[3/4] rounded-3xl border border-white/25 overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.35)] select-none bg-black"
      >
        {/* Imagen del Ramo de Flores Espectacular */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/day7-bouquet.jpg"
          alt="Ramo de flores espectacular y mágico"
          className="h-full w-full object-cover transition-all duration-700"
          style={{
            filter: `brightness(${1 + revealedIds.length * 0.02}) saturate(${
              1 + revealedIds.length * 0.03
            })`,
          }}
        />

        {/* Halo resplandeciente de fondo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* 13 FLORES INTERACTIVAS MAPICADAS DIRECTAMENTE SOBRE LAS FLORES */}
        {BOUQUET_FLOWERS.map((flower) => {
          const isRevealed = revealedIds.includes(flower.id);

          return (
            <div
              key={flower.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
            >
              <motion.button
                type="button"
                onClick={() => handleOpenFlower(flower)}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center justify-center"
              >
                {/* Aura radiante animada */}
                <motion.div
                  animate={{
                    scale: isRevealed ? [1, 1.4, 1] : [0.9, 1.2, 0.9],
                    opacity: isRevealed ? [0.7, 1, 0.7] : [0.4, 0.85, 0.4],
                  }}
                  transition={{
                    duration: isRevealed ? 1.8 : 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-2.5 rounded-full blur-md"
                  style={{ background: flower.glowColor }}
                />

                {/* Botón de la Flor */}
                <div
                  className={`relative flex items-center justify-center rounded-full border transition-all duration-300 ${
                    isRevealed
                      ? `h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br ${flower.colorGrad} border-white shadow-[0_0_20px_${flower.glowColor}] ring-2 ring-white/70 scale-110`
                      : "h-7 w-7 sm:h-8 sm:w-8 bg-black/60 border-amber-300/80 shadow-[0_0_12px_rgba(251,191,36,0.8)] backdrop-blur-md"
                  }`}
                >
                  {isRevealed ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 text-white drop-shadow stroke-[3]" />
                    </motion.div>
                  ) : (
                    <span className="text-xs sm:text-sm animate-pulse drop-shadow">
                      ✨
                    </span>
                  )}
                </div>
              </motion.button>
            </div>
          );
        })}
      </motion.div>

      {/* Cierre cuando todas las flores han sido abiertas */}
      {isAllRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-2xl border border-pink-400/40 bg-gradient-to-br from-pink-500/20 via-purple-900/30 to-amber-500/20 p-5 shadow-2xl backdrop-blur-md space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-pink-300 font-serif text-base sm:text-lg font-bold">
            <Heart className="h-5 w-5 fill-pink-400 text-pink-400" />
            <span>¡Has completado todo el ramo!</span>
            <Heart className="h-5 w-5 fill-pink-400 text-pink-400" />
          </div>

          <p className="text-xs sm:text-sm text-white/90 font-serif italic">
            “13 flores, 13 verdades y un millón de razones para quererte.”
          </p>

          <button
            type="button"
            onClick={() => setShowFullLetter(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>Leer toda la carta de amor 💌</span>
          </button>
        </motion.div>
      )}

      {/* MODAL 1: FLOR INDIVIDUAL ABIERTA (DEDICATORIA) */}
      <AnimatePresence>
        {activeFlower && !showFullLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 25 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-b from-[#2f0e38] via-[#1a0a27] to-[#0e0417] p-7 text-center shadow-[0_0_50px_rgba(236,72,153,0.4)]"
            >
              <button
                onClick={() => setActiveFlower(null)}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>

              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${activeFlower.colorGrad} shadow-2xl text-3xl`}
                style={{ boxShadow: `0 0 26px ${activeFlower.glowColor}` }}
              >
                {activeFlower.emoji}
              </div>

              <p className="text-xs font-mono uppercase tracking-widest text-pink-300/80">
                Flor #{activeFlower.id} · {activeFlower.name}
              </p>

              <p className="mt-4 font-serif text-lg sm:text-xl font-medium leading-relaxed text-white drop-shadow">
                “{activeFlower.text}”
              </p>

              <button
                type="button"
                onClick={() => setActiveFlower(null)}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Seguir abriendo flores</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: TODA LA CARTA DE AMOR COMPLETA */}
      <AnimatePresence>
        {showFullLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl border border-white/20 bg-gradient-to-b from-[#2a0e36] to-[#12051c] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/15 shrink-0">
                <div className="flex items-center gap-2 text-pink-300 font-serif font-bold text-lg">
                  <Heart className="h-5 w-5 fill-pink-400 text-pink-400" />
                  <span>Nuestra Carta de Amor</span>
                </div>
                <button
                  onClick={() => setShowFullLetter(false)}
                  className="rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contenido con scroll */}
              <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 text-left">
                {BOUQUET_FLOWERS.map((flower) => (
                  <div
                    key={flower.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md"
                  >
                    <span className="text-2xl shrink-0">{flower.emoji}</span>
                    <p className="text-xs sm:text-sm leading-relaxed text-white/95 font-serif">
                      {flower.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/15 shrink-0 text-center">
                <p className="text-xs text-pink-200/90 font-serif italic mb-3">
                  Te amo con todo mi corazón.
                </p>
                <button
                  type="button"
                  onClick={() => setShowFullLetter(false)}
                  className="w-full rounded-full bg-pink-500 py-2.5 text-xs font-semibold text-white"
                >
                  Volver al ramo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Day7;
