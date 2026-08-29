"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, X, Flower2, BookOpen, ChevronRight } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

interface FlowerNode {
  id: number;
  x: number; // Porcentaje X (0-100) en el lienzo del ramo
  y: number; // Porcentaje Y (0-100)
  name: string;
  emoji: string;
  colorGrad: string;
  auraColor: string;
  bloomEmoji: string;
  stemPath: string; // Curva SVG del tallo desde la base (200, 430)
  text: string;
}

const BOUQUET_NODES: FlowerNode[] = [
  {
    id: 1,
    x: 50,
    y: 12,
    name: "Rosa Real",
    emoji: "🌹",
    bloomEmoji: "💋",
    colorGrad: "from-rose-500 via-red-500 to-pink-600",
    auraColor: "rgba(244,63,94,0.7)",
    stemPath: "M200,430 Q200,260 200,90",
    text: "Amo todos los besos que me das a diario y todas las veces que me pides que te dé más.",
  },
  {
    id: 2,
    x: 32,
    y: 18,
    name: "Peonía Rosa",
    emoji: "🌸",
    bloomEmoji: "🌸",
    colorGrad: "from-pink-400 via-rose-400 to-fuchsia-500",
    auraColor: "rgba(244,114,182,0.7)",
    stemPath: "M200,430 Q160,260 130,120",
    text: "Amo cuidarte, mimarte y consentirte cada vez que puedo.",
  },
  {
    id: 3,
    x: 68,
    y: 18,
    name: "Orquídea Violeta",
    emoji: "🌺",
    bloomEmoji: "🌺",
    colorGrad: "from-fuchsia-400 via-purple-500 to-pink-600",
    auraColor: "rgba(217,70,239,0.7)",
    stemPath: "M200,430 Q240,260 270,120",
    text: "Amo que tú también me cuides y me mimes cuando puedes.",
  },
  {
    id: 4,
    x: 18,
    y: 28,
    name: "Flor de Loto",
    emoji: "✨",
    bloomEmoji: "✨",
    colorGrad: "from-amber-300 via-yellow-400 to-orange-500",
    auraColor: "rgba(251,191,36,0.7)",
    stemPath: "M200,430 Q130,300 75,170",
    text: "Amo la buena persona que eres y que me haces ser.",
  },
  {
    id: 5,
    x: 82,
    y: 28,
    name: "Flor de Cerezo",
    emoji: "🍳",
    bloomEmoji: "🍳",
    colorGrad: "from-orange-400 via-rose-400 to-red-500",
    auraColor: "rgba(249,115,22,0.7)",
    stemPath: "M200,430 Q270,300 325,170",
    text: "Amo cada comida que me preparas con esfuerzo y amor.",
  },
  {
    id: 6,
    x: 38,
    y: 35,
    name: "Girasol de Luz",
    emoji: "👑",
    bloomEmoji: "👑",
    colorGrad: "from-yellow-300 via-amber-400 to-orange-500",
    auraColor: "rgba(250,204,21,0.7)",
    stemPath: "M200,430 Q170,320 150,200",
    text: "Amo lo orgulloso que me haces sentir de tenerte y lo bien que me siento al hablar de ti.",
  },
  {
    id: 7,
    x: 62,
    y: 35,
    name: "Tulipán Radiante",
    emoji: "💬",
    bloomEmoji: "💬",
    colorGrad: "from-violet-400 via-fuchsia-500 to-purple-600",
    auraColor: "rgba(167,139,250,0.7)",
    stemPath: "M200,430 Q230,320 250,200",
    text: "Amo lo bien que hablas de mí a otros.",
  },
  {
    id: 8,
    x: 50,
    y: 45,
    name: "Corazón Floral",
    emoji: "🤝",
    bloomEmoji: "🤝",
    colorGrad: "from-emerald-400 via-teal-500 to-cyan-600",
    auraColor: "rgba(45,212,191,0.7)",
    stemPath: "M200,430 Q200,340 200,245",
    text: "Amo la forma en que me respetas a mí y cuidas nuestra relación.",
  },
  {
    id: 9,
    x: 24,
    y: 48,
    name: "Dalia Magenta",
    emoji: "🎁",
    bloomEmoji: "🎁",
    colorGrad: "from-pink-500 via-rose-500 to-purple-600",
    auraColor: "rgba(236,72,153,0.7)",
    stemPath: "M200,430 Q150,360 95,265",
    text: "Amo cada vez que te acuerdas de mí y tienes detalles conmigo.",
  },
  {
    id: 10,
    x: 76,
    y: 48,
    name: "Lirio Mágico",
    emoji: "💍",
    bloomEmoji: "💍",
    colorGrad: "from-rose-400 via-pink-500 to-fuchsia-600",
    auraColor: "rgba(251,113,133,0.7)",
    stemPath: "M200,430 Q250,360 305,265",
    text: "Amo a mi futura mujer.",
  },
  {
    id: 11,
    x: 35,
    y: 60,
    name: "Margarita Dorada",
    emoji: "👨‍👩‍👧",
    bloomEmoji: "👨‍👩‍👧",
    colorGrad: "from-indigo-400 via-purple-500 to-pink-500",
    auraColor: "rgba(129,140,248,0.7)",
    stemPath: "M200,430 Q170,380 140,320",
    text: "Amo la forma en la que cuidas a tu familia y sobre todo a tu hermano.",
  },
  {
    id: 12,
    x: 65,
    y: 60,
    name: "Clavel de Pasión",
    emoji: "🔥",
    bloomEmoji: "🔥",
    colorGrad: "from-red-500 via-rose-500 to-amber-500",
    auraColor: "rgba(239,68,68,0.7)",
    stemPath: "M200,430 Q230,380 260,320",
    text: "Amo cada parte de tu cuerpo.",
  },
  {
    id: 13,
    x: 50,
    y: 68,
    name: "Flor del Deseo",
    emoji: "🍑",
    bloomEmoji: "🍑",
    colorGrad: "from-orange-400 via-pink-500 to-rose-600",
    auraColor: "rgba(251,146,60,0.8)",
    stemPath: "M200,430 Q200,390 200,350",
    text: "Amo darte cachetes en el culo y otras cosas... cuando te agachas.",
  },
];

/**
 * Día 7: Ramo Ficticio Mágico y Creciente con 13 Flores Reales Interactivas.
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

  const isAllRevealed = revealedIds.length === BOUQUET_NODES.length;
  const progressPercent = (revealedIds.length / BOUQUET_NODES.length) * 100;

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
            <span>Un Regalo del Corazón</span>
            <Sparkles className="h-4 w-4" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Lo que más amo de ti
          </h3>

          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-5 text-left space-y-3">
            <p className="text-sm sm:text-base leading-relaxed text-white/95 font-serif italic">
              “Hoy no hay un paquete físico esperándote... pero te he preparado algo infinitamente más especial y verdadero:”
            </p>
            <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed">
              Un <strong>ramo mágico interactivo</strong> que irá floreciendo ante tus ojos. Cada flor guarda una de las 13 razones por las que me vuelves loco cada día.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => setHasStartedBouquet(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-6 py-4 font-semibold text-white shadow-2xl transition hover:brightness-110 flex items-center justify-center gap-2 text-base"
          >
            <span>Hacer florecer nuestro ramo</span>
            <Sparkles className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // FASE 2: EL RAMO REAL MÁGICO CRECIENDO
  // ==========================================
  return (
    <div className="relative flex flex-col items-center space-y-4 text-center">
      {/* Barra de progreso superior */}
      <div className="w-full max-w-sm space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-pink-300 px-1">
          <span>Flores abiertas: {revealedIds.length} / 13</span>
          <span>{isAllRevealed ? "¡Ramo Completo! ✨" : "Toca cada flor"}</span>
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

      {/* LIENZO DEL RAMO FLORAL ESPECTACULAR (SVG + ELEMENTOS ORGÁNICOS) */}
      <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-3xl border border-white/20 bg-gradient-to-b from-[#1c0828]/90 via-[#13051d]/95 to-[#09020f] overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.25)] p-2">
        {/* Aura luminosa de fondo que crece con cada flor descubierta */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700"
          style={{
            width: `${160 + revealedIds.length * 15}px`,
            height: `${160 + revealedIds.length * 15}px`,
            background:
              revealedIds.length > 8
                ? "radial-gradient(circle, rgba(244,114,182,0.45) 0%, rgba(251,191,36,0.3) 50%, transparent 70%)"
                : "radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)",
          }}
        />

        {/* ESTRUCTURA BOTÁNICA (TALLOS, HOJAS Y LAZO) */}
        <svg
          viewBox="0 0 400 500"
          className="absolute inset-0 h-full w-full pointer-events-none"
        >
          <defs>
            <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Hojas decorativas de fondo */}
          <path
            d="M200,410 Q120,330 90,290 Q120,270 200,370"
            fill="rgba(16,185,129,0.3)"
          />
          <path
            d="M200,410 Q280,330 310,290 Q280,270 200,370"
            fill="rgba(16,185,129,0.3)"
          />
          <path
            d="M200,380 Q130,220 80,180 Q130,170 200,320"
            fill="rgba(52,211,153,0.35)"
          />
          <path
            d="M200,380 Q270,220 320,180 Q270,170 200,320"
            fill="rgba(52,211,153,0.35)"
          />

          {/* Tallos vivos hacia cada una de las 13 flores */}
          {BOUQUET_NODES.map((node) => {
            const isRevealed = revealedIds.includes(node.id);
            return (
              <motion.path
                key={node.id}
                d={node.stemPath}
                fill="none"
                stroke="url(#stemGrad)"
                strokeWidth={isRevealed ? "3" : "2"}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: node.id * 0.05 }}
              />
            );
          })}

          {/* Envoltorio / Lazo de Satén Dorado y Rosa en la base */}
          <g transform="translate(200, 440)">
            <ellipse cx="0" cy="5" rx="42" ry="16" fill="url(#ribbonGrad)" />
            {/* Lazo y lazos colgantes */}
            <path
              d="M-30,0 Q-45,-15 -20,-20 Q-5,-10 0,0 Q5,-10 20,-20 Q45,-15 30,0 Z"
              fill="#fb7185"
            />
            <circle cx="0" cy="-2" r="7" fill="#f59e0b" />
            <path
              d="M-10,5 Q-25,35 -35,50 M10,5 Q25,35 35,50"
              stroke="#fb7185"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* 13 FLORES INTERACTIVAS DISTRIBUIDAS ORGÁNICAMENTE */}
        {BOUQUET_NODES.map((flower) => {
          const isRevealed = revealedIds.includes(flower.id);

          return (
            <div
              key={flower.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
            >
              <motion.button
                type="button"
                onClick={() => handleOpenFlower(flower)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center justify-center select-none"
              >
                {/* Halo pulsante de flor cerrada o abierta */}
                <motion.div
                  animate={{
                    scale: isRevealed ? [1, 1.25, 1] : [0.9, 1.1, 0.9],
                    opacity: isRevealed ? [0.6, 0.9, 0.6] : [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: isRevealed ? 2 : 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 -m-3 rounded-full blur-md"
                  style={{ background: flower.auraColor }}
                />

                {/* Flor Florecida vs Capullo Luminoso */}
                <div
                  className={`relative flex items-center justify-center rounded-full border transition-all duration-300 ${
                    isRevealed
                      ? `h-11 w-11 sm:h-12 sm:w-12 bg-gradient-to-br ${flower.colorGrad} border-white/60 shadow-xl scale-110`
                      : "h-9 w-9 sm:h-10 sm:w-10 bg-[#1f0b29]/85 border-pink-400/40 hover:border-pink-300"
                  }`}
                >
                  {isRevealed ? (
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="text-xl sm:text-2xl drop-shadow"
                    >
                      {flower.bloomEmoji}
                    </motion.span>
                  ) : (
                    <span className="text-sm sm:text-base animate-pulse">
                      🌷
                    </span>
                  )}
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Cierre cuando todas las flores han sido abiertas */}
      {isAllRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-2xl border border-pink-400/40 bg-gradient-to-br from-pink-500/20 via-purple-900/30 to-amber-500/20 p-5 shadow-2xl backdrop-blur-md space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-pink-300 font-serif text-base sm:text-lg font-bold">
            <Heart className="h-5 w-5 fill-pink-400 text-pink-400" />
            <span>¡Tu ramo está en pleno esplendor!</span>
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
                style={{ boxShadow: `0 0 26px ${activeFlower.auraColor}` }}
              >
                {activeFlower.bloomEmoji}
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
                {BOUQUET_NODES.map((flower) => (
                  <div
                    key={flower.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md"
                  >
                    <span className="text-2xl shrink-0">{flower.bloomEmoji}</span>
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
