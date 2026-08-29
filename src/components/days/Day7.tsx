"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, X, CheckCircle2, Flower2 } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

interface FlowerItem {
  id: number;
  emoji: string;
  color: string;
  shadow: string;
  text: string;
}

const BOUQUET_FLOWERS: FlowerItem[] = [
  {
    id: 1,
    emoji: "💋",
    color: "from-rose-500 to-red-600",
    shadow: "rgba(244,63,94,0.6)",
    text: "Amo todos los besos que me das a diario y todas las veces que me pides que te dé más.",
  },
  {
    id: 2,
    emoji: "🌸",
    color: "from-pink-400 to-rose-500",
    shadow: "rgba(244,114,182,0.6)",
    text: "Amo cuidarte, mimarte y consentirte cada vez que puedo.",
  },
  {
    id: 3,
    emoji: "🌺",
    color: "from-fuchsia-500 to-pink-600",
    shadow: "rgba(217,70,239,0.6)",
    text: "Amo que tú también me cuides y me mimes cuando puedes.",
  },
  {
    id: 4,
    emoji: "✨",
    color: "from-amber-400 to-orange-500",
    shadow: "rgba(251,191,36,0.6)",
    text: "Amo la buena persona que eres y que me haces ser.",
  },
  {
    id: 5,
    emoji: "🍳",
    color: "from-orange-400 to-rose-500",
    shadow: "rgba(249,115,22,0.6)",
    text: "Amo cada comida que me preparas con esfuerzo y amor.",
  },
  {
    id: 6,
    emoji: "👑",
    color: "from-yellow-400 to-amber-600",
    shadow: "rgba(250,204,21,0.6)",
    text: "Amo lo orgulloso que me haces sentir de tenerte y lo bien que me siento al hablar de ti.",
  },
  {
    id: 7,
    emoji: "💬",
    color: "from-violet-400 to-purple-600",
    shadow: "rgba(167,139,250,0.6)",
    text: "Amo lo bien que hablas de mí a otros.",
  },
  {
    id: 8,
    emoji: "🤝",
    color: "from-teal-400 to-emerald-600",
    shadow: "rgba(45,212,191,0.6)",
    text: "Amo la forma en que me respetas a mí y cuidas nuestra relación.",
  },
  {
    id: 9,
    emoji: "🎁",
    color: "from-pink-500 to-purple-600",
    shadow: "rgba(236,72,153,0.6)",
    text: "Amo cada vez que te acuerdas de mí y tienes detalles conmigo.",
  },
  {
    id: 10,
    emoji: "💍",
    color: "from-rose-400 to-pink-600",
    shadow: "rgba(251,113,133,0.6)",
    text: "Amo a mi futura mujer.",
  },
  {
    id: 11,
    emoji: "👨‍👩‍👧",
    color: "from-indigo-400 to-purple-600",
    shadow: "rgba(129,140,248,0.6)",
    text: "Amo la forma en la que cuidas a tu familia y sobre todo a tu hermano.",
  },
  {
    id: 12,
    emoji: "🔥",
    color: "from-red-500 to-pink-600",
    shadow: "rgba(239,68,68,0.6)",
    text: "Amo cada parte de tu cuerpo.",
  },
  {
    id: 13,
    emoji: "🍑",
    color: "from-orange-400 to-pink-500",
    shadow: "rgba(251,146,60,0.6)",
    text: "Amo darte cachetes en el culo y otras cosas... cuando te agachas.",
  },
];

/**
 * Día 7: Ramo Interactivo de 13 Flores con las cosas que más amo de ti.
 */
export function Day7({ config, isUnlocked }: DayComponentProps) {
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [activeFlower, setActiveFlower] = useState<FlowerItem | null>(null);
  const [showFullList, setShowFullList] = useState(false);

  if (!isUnlocked) return null;

  const handleOpenFlower = (flower: FlowerItem) => {
    setActiveFlower(flower);
    if (!revealedIds.includes(flower.id)) {
      setRevealedIds((prev) => [...prev, flower.id]);
    }
  };

  const isAllRevealed = revealedIds.length === BOUQUET_FLOWERS.length;
  const progressPercent = (revealedIds.length / BOUQUET_FLOWERS.length) * 100;

  return (
    <div className="relative space-y-5 text-center">
      {/* Cabecera del ramo */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-300 backdrop-blur-md">
          <Flower2 className="h-4 w-4" />
          <span>Ramo de Amor Especial</span>
          <Sparkles className="h-4 w-4" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          {config.rewardTitle || "Lo que más amo de ti"}
        </h3>

        <p className="max-w-md mx-auto text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
          {config.rewardDescription ||
            "Hoy no hay premio físico, pero te he preparado un ramo con las cosas que más me gustan de ti 💐 Toca cada flor para abrir sus pétalos:"}
        </p>

        {/* Barra de progreso de flores descubiertas */}
        <div className="pt-2 max-w-xs mx-auto space-y-1.5">
          <div className="flex justify-between text-xs text-pink-200/90 font-medium px-1">
            <span>Flores abiertas:</span>
            <span>{revealedIds.length} / {BOUQUET_FLOWERS.length}</span>
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
      </div>

      {/* Cuadrícula interactiva del Ramo (13 Flores) */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-sm mx-auto p-1">
        {BOUQUET_FLOWERS.map((flower, idx) => {
          const isRevealed = revealedIds.includes(flower.id);
          // La flor 13 la centramos en la última fila ocupando más espacio
          const isLast = idx === BOUQUET_FLOWERS.length - 1;

          return (
            <motion.button
              key={flower.id}
              type="button"
              onClick={() => handleOpenFlower(flower)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`relative flex aspect-square items-center justify-center rounded-2xl border transition-all select-none ${
                isLast ? "col-span-4 aspect-[4/1] py-2" : ""
              } ${
                isRevealed
                  ? `bg-gradient-to-br ${flower.color} border-white/40 shadow-lg`
                  : "bg-white/10 border-white/20 hover:bg-white/20 active:bg-white/25 backdrop-blur-md"
              }`}
              style={
                isRevealed
                  ? { boxShadow: `0 0 16px ${flower.shadow}` }
                  : undefined
              }
            >
              {isRevealed ? (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  <span className="text-2xl sm:text-3xl drop-shadow">{flower.emoji}</span>
                  {isLast && (
                    <span className="text-xs font-semibold text-white drop-shadow">
                      Pétalo Final 🍑
                    </span>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl opacity-70 animate-pulse">🌷</span>
                  <span className="text-[10px] font-mono text-white/60">#{flower.id}</span>
                </div>
              )}

              {isRevealed && (
                <CheckCircle2 className="absolute top-1 right-1 h-3 w-3 text-white/80" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tarjeta de Celebración al abrir todas las flores */}
      {isAllRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-pink-400/40 bg-gradient-to-br from-pink-500/25 to-purple-900/40 p-5 text-center shadow-2xl backdrop-blur-md space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-pink-300 font-serif text-lg font-bold">
            <Heart className="h-5 w-5 fill-pink-400 text-pink-400" />
            <span>¡Has completado el ramo entero!</span>
            <Heart className="h-5 w-5 fill-pink-400 text-pink-400" />
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-serif italic">
            “Gracias por ser exactamente como eres. Te amo con todo mi corazón.”
          </p>
          <button
            type="button"
            onClick={() => setShowFullList(!showFullList)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/30 active:scale-95"
          >
            <span>{showFullList ? "Ocultar lista completa" : "Ver todas las dedicatorias"}</span>
          </button>
        </motion.div>
      )}

      {/* Lista completa de frases si se solicita */}
      {showFullList && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2.5 pt-2 text-left"
        >
          {BOUQUET_FLOWERS.map((flower) => (
            <div
              key={flower.id}
              className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md"
            >
              <span className="text-2xl shrink-0">{flower.emoji}</span>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-serif">
                {flower.text}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Modal / Tarjeta Flotante al pulsar una flor */}
      <AnimatePresence>
        {activeFlower && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-b from-[#2b1035] via-[#1a0a28] to-[#12061c] p-7 text-center shadow-[0_0_50px_rgba(236,72,153,0.35)]"
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setActiveFlower(null)}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Icono de la flor */}
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${activeFlower.color} shadow-xl text-3xl`}
                style={{ boxShadow: `0 0 24px ${activeFlower.shadow}` }}
              >
                {activeFlower.emoji}
              </div>

              <span className="text-[11px] font-mono uppercase tracking-widest text-pink-300/80">
                Flor #{activeFlower.id} de 13
              </span>

              <p className="mt-4 font-serif text-lg sm:text-xl font-medium leading-relaxed text-white drop-shadow">
                “{activeFlower.text}”
              </p>

              <button
                type="button"
                onClick={() => setActiveFlower(null)}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition active:scale-95"
              >
                Seguir abriendo flores 🌸
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Day7;
