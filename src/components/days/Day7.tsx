"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, X, BookOpen, ChevronRight, Flower2 } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

interface FlowerData {
  id: number;
  cx: number; // Coordenada X (0-400)
  cy: number; // Coordenada Y (0-520)
  stemD: string; // Trazado SVG del tallo
  name: string;
  type: "rose" | "peony" | "orchid" | "lotus" | "dahlia" | "sunflower" | "lily";
  colorStart: string;
  colorMid: string;
  colorEnd: string;
  glowRgba: string;
  emoji: string;
  text: string;
}

const FLOWERS: FlowerData[] = [
  {
    id: 1,
    cx: 200,
    cy: 75,
    stemD: "M200,470 Q200,280 200,75",
    name: "Gran Rosa Eterna",
    type: "rose",
    colorStart: "#ff2a6d",
    colorMid: "#e11d48",
    colorEnd: "#881337",
    glowRgba: "rgba(255, 42, 109, 0.9)",
    emoji: "💋",
    text: "Amo todos los besos que me das a diario y todas las veces que me pides que te dé más.",
  },
  {
    id: 2,
    cx: 125,
    cy: 100,
    stemD: "M200,470 Q160,290 125,100",
    name: "Peonía Rosa Blush",
    type: "peony",
    colorStart: "#f472b6",
    colorMid: "#db2777",
    colorEnd: "#9d174d",
    glowRgba: "rgba(244, 114, 182, 0.9)",
    emoji: "🌸",
    text: "Amo cuidarte, mimarte y consentirte cada vez que puedo.",
  },
  {
    id: 3,
    cx: 275,
    cy: 100,
    stemD: "M200,470 Q240,290 275,100",
    name: "Orquídea Púrpura",
    type: "orchid",
    colorStart: "#c084fc",
    colorMid: "#9333ea",
    colorEnd: "#581c87",
    glowRgba: "rgba(192, 132, 252, 0.9)",
    emoji: "🌺",
    text: "Amo que tú también me cuides y me mimes cuando puedes.",
  },
  {
    id: 4,
    cx: 65,
    cy: 150,
    stemD: "M200,470 Q120,330 65,150",
    name: "Flor de Loto Dorada",
    type: "lotus",
    colorStart: "#fde047",
    colorMid: "#f59e0b",
    colorEnd: "#b45309",
    glowRgba: "rgba(253, 224, 71, 0.9)",
    emoji: "✨",
    text: "Amo la buena persona que eres y que me haces ser.",
  },
  {
    id: 5,
    cx: 335,
    cy: 150,
    stemD: "M200,470 Q280,330 335,150",
    name: "Flor de Cerezo Carmesí",
    type: "rose",
    colorStart: "#fb7185",
    colorMid: "#e11d48",
    colorEnd: "#9f1239",
    glowRgba: "rgba(251, 113, 133, 0.9)",
    emoji: "🍳",
    text: "Amo cada comida que me preparas con esfuerzo y amor.",
  },
  {
    id: 6,
    cx: 145,
    cy: 175,
    stemD: "M200,470 Q170,330 145,175",
    name: "Girasol de Fuego",
    type: "sunflower",
    colorStart: "#fbbf24",
    colorMid: "#ea580c",
    colorEnd: "#9a3412",
    glowRgba: "rgba(251, 191, 36, 0.9)",
    emoji: "👑",
    text: "Amo lo orgulloso que me haces sentir de tenerte y lo bien que me siento al hablar de ti.",
  },
  {
    id: 7,
    cx: 255,
    cy: 175,
    stemD: "M200,470 Q230,330 255,175",
    name: "Dalia de Amatista",
    type: "dahlia",
    colorStart: "#e879f9",
    colorMid: "#c026d3",
    colorEnd: "#701a75",
    glowRgba: "rgba(232, 121, 249, 0.9)",
    emoji: "💬",
    text: "Amo lo bien que hablas de mí a otros.",
  },
  {
    id: 8,
    cx: 200,
    cy: 220,
    stemD: "M200,470 Q200,350 200,220",
    name: "Rosa Rubí Central",
    type: "rose",
    colorStart: "#f43f5e",
    colorMid: "#be123c",
    colorEnd: "#4c0519",
    glowRgba: "rgba(244, 63, 94, 0.95)",
    emoji: "🤝",
    text: "Amo la forma en que me respetas a mí y cuidas nuestra relación.",
  },
  {
    id: 9,
    cx: 90,
    cy: 245,
    stemD: "M200,470 Q140,370 90,245",
    name: "Orquídea Fucsia",
    type: "orchid",
    colorStart: "#f472b6",
    colorMid: "#be185d",
    colorEnd: "#831843",
    glowRgba: "rgba(244, 114, 182, 0.9)",
    emoji: "🎁",
    text: "Amo cada vez que te acuerdas de mí y tienes detalles conmigo.",
  },
  {
    id: 10,
    cx: 310,
    cy: 245,
    stemD: "M200,470 Q260,370 310,245",
    name: "Lirio de Cristal",
    type: "lily",
    colorStart: "#38bdf8",
    colorMid: "#0284c7",
    colorEnd: "#075985",
    glowRgba: "rgba(56, 189, 248, 0.9)",
    emoji: "💍",
    text: "Amo a mi futura mujer.",
  },
  {
    id: 11,
    cx: 135,
    cy: 305,
    stemD: "M200,470 Q170,390 135,305",
    name: "Peonía Coral",
    type: "peony",
    colorStart: "#fb923c",
    colorMid: "#e11d48",
    colorEnd: "#9f1239",
    glowRgba: "rgba(251, 146, 60, 0.9)",
    emoji: "👨‍👩‍👧",
    text: "Amo la forma en la que cuidas a tu familia y sobre todo a tu hermano.",
  },
  {
    id: 12,
    cx: 265,
    cy: 305,
    stemD: "M200,470 Q230,390 265,305",
    name: "Dalia de Fuego",
    type: "dahlia",
    colorStart: "#f87171",
    colorMid: "#dc2626",
    colorEnd: "#7f1d1d",
    glowRgba: "rgba(248, 113, 113, 0.9)",
    emoji: "🔥",
    text: "Amo cada parte de tu cuerpo.",
  },
  {
    id: 13,
    cx: 200,
    cy: 350,
    stemD: "M200,470 Q200,410 200,350",
    name: "Capullo de la Pasión",
    type: "lotus",
    colorStart: "#fb7185",
    colorMid: "#f59e0b",
    colorEnd: "#ea580c",
    glowRgba: "rgba(251, 113, 133, 0.95)",
    emoji: "🍑",
    text: "Amo darte cachetes en el culo y otras cosas... cuando te agachas.",
  },
];

/**
 * Componente que dibuja una flor botánica vectorial brillante en SVG
 */
function FlowerGraphic({
  flower,
  isBloomed,
  onClick,
}: {
  flower: FlowerData;
  isBloomed: boolean;
  onClick: () => void;
}) {
  const gradId = `flowerGrad-${flower.id}`;
  const glowId = `flowerGlow-${flower.id}`;

  return (
    <g
      transform={`translate(${flower.cx}, ${flower.cy})`}
      className="cursor-pointer select-none"
      onClick={onClick}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={flower.colorStart} />
          <stop offset="60%" stopColor={flower.colorMid} />
          <stop offset="100%" stopColor={flower.colorEnd} />
        </radialGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isBloomed ? "6" : "3"} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Aura pulsante de luz exterior */}
      <motion.circle
        r={isBloomed ? 28 : 16}
        fill={flower.glowRgba}
        opacity={isBloomed ? 0.6 : 0.3}
        animate={{
          r: isBloomed ? [26, 32, 26] : [14, 18, 14],
          opacity: isBloomed ? [0.5, 0.8, 0.5] : [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* PÉTALOS BOTÁNICOS REALISTAS CON ANIMACIÓN DE CRECIMIENTO */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: isBloomed ? 1.25 : 0.85 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        filter={`url(#${glowId})`}
      >
        {/* Capa de pétalos exteriores (8 pétalos) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.path
            key={i}
            d="M0,0 C-10,-12 -12,-24 0,-28 C12,-24 10,-12 0,0 Z"
            fill={`url(#${gradId})`}
            opacity={isBloomed ? 0.95 : 0.7}
            transform={`rotate(${angle})`}
            stroke="#ffffff"
            strokeWidth={isBloomed ? "0.8" : "0.3"}
            strokeOpacity="0.6"
          />
        ))}

        {/* Capa de pétalos interiores superpuestos (4 pétalos) */}
        {isBloomed &&
          [22.5, 112.5, 202.5, 292.5].map((angle, i) => (
            <motion.path
              key={`inner-${i}`}
              d="M0,0 C-7,-8 -8,-18 0,-21 C8,-18 7,-8 0,0 Z"
              fill={flower.colorStart}
              transform={`rotate(${angle})`}
              opacity={0.9}
            />
          ))}

        {/* Centro luminoso con destello / emoji */}
        <circle r={isBloomed ? 9 : 6} fill="#ffffff" opacity={0.95} />
        <circle r={isBloomed ? 7 : 4} fill={flower.colorStart} />
      </motion.g>

      {/* Número / Indicador táctil */}
      {!isBloomed ? (
        <text
          y="3"
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fill="#ffffff"
          className="pointer-events-none drop-shadow"
        >
          {flower.id}
        </text>
      ) : (
        <text
          y="4"
          textAnchor="middle"
          fontSize="11"
          className="pointer-events-none drop-shadow"
        >
          {flower.emoji}
        </text>
      )}
    </g>
  );
}

/**
 * Día 7: Ramo Ficticio Espectacular Creciendo desde 0 con Flores Luminosas y Carta de Amor.
 */
export function Day7({ isUnlocked }: DayComponentProps) {
  const [hasStartedGrowth, setHasStartedGrowth] = useState(false);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [activeFlower, setActiveFlower] = useState<FlowerData | null>(null);
  const [showFullLetter, setShowFullLetter] = useState(false);

  if (!isUnlocked) return null;

  const handleOpenFlower = (flower: FlowerData) => {
    setActiveFlower(flower);
    if (!revealedIds.includes(flower.id)) {
      setRevealedIds((prev) => [...prev, flower.id]);
    }
  };

  const isAllRevealed = revealedIds.length === FLOWERS.length;
  const progressPercent = (revealedIds.length / FLOWERS.length) * 100;

  // ==========================================
  // FASE 1: MENSAJE INTRODUCTORIO
  // ==========================================
  if (!hasStartedGrowth) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#2d1138] via-[#1a0c28] to-[#10051d] p-7 text-center shadow-2xl backdrop-blur-xl space-y-6"
      >
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
              Un <strong>ramo mágico creciente</strong> que florecerá ante ti. Toca cada flor brillante para abrir sus pétalos y descubrir las 13 cosas que me hacen amarte cada día.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => setHasStartedGrowth(true)}
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
  // FASE 2: ANIMACIÓN DEL RAMO CRECIENDO
  // ==========================================
  return (
    <div className="relative flex flex-col items-center space-y-4 text-center select-none">
      {/* Barra de progreso superior */}
      <div className="w-full max-w-sm space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-pink-300 px-1">
          <span>Flores abiertas: {revealedIds.length} / 13</span>
          <span>{isAllRevealed ? "¡Ramo en máximo esplendor! ✨" : "Toca las flores"}</span>
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

      {/* LIENZO SVG: EL RAMO BOTÁNICO CRECIENDO EN EL ESPACIO NOCTURNO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[370px] aspect-[4/5] rounded-3xl border border-white/20 bg-gradient-to-b from-[#180624] via-[#100318] to-[#08020c] overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.35)]"
      >
        {/* Nebulosa de luz de fondo que se expande con el progreso */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: `${200 + revealedIds.length * 15}px`,
            height: `${200 + revealedIds.length * 15}px`,
            background:
              "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(217,70,239,0.25) 40%, rgba(251,191,36,0.15) 70%, transparent 80%)",
          }}
        />

        {/* Destellos de estrellas mágicas de fondo */}
        {[
          { cx: 50, cy: 60, r: 1.5 },
          { cx: 350, cy: 80, r: 2 },
          { cx: 90, cy: 300, r: 1.5 },
          { cx: 310, cy: 320, r: 2 },
          { cx: 200, cy: 30, r: 2.5 },
        ].map((star, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
            className="absolute rounded-full bg-white shadow-[0_0_8px_#ffffff]"
            style={{
              left: `${(star.cx / 400) * 100}%`,
              top: `${(star.cy / 520) * 100}%`,
              width: `${star.r * 2}px`,
              height: `${star.r * 2}px`,
            }}
          />
        ))}

        <svg viewBox="0 0 400 520" className="absolute inset-0 h-full w-full">
          <defs>
            {/* Gradientes para tallos */}
            <linearGradient id="emeraldStem" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="wrapGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b0764" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>

          {/* 1. ENVOLTORIO FLORAL ELEGANTE (CONO BASE) */}
          <motion.path
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "200px 500px" }}
            d="M130,390 L200,500 L270,390 Q200,430 130,390 Z"
            fill="url(#wrapGrad)"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />

          {/* 2. HOJAS VERDES BOTÁNICAS QUE BROTAN */}
          {[
            { d: "M200,420 Q120,360 80,320 Q130,300 200,380", delay: 0.4 },
            { d: "M200,420 Q280,360 320,320 Q270,300 200,380", delay: 0.5 },
            { d: "M200,360 Q110,240 60,200 Q120,180 200,300", delay: 0.6 },
            { d: "M200,360 Q290,240 340,200 Q280,180 200,300", delay: 0.7 },
            { d: "M200,300 Q150,160 110,130 Q160,120 200,240", delay: 0.8 },
            { d: "M200,300 Q250,160 290,130 Q240,120 200,240", delay: 0.9 },
          ].map((leaf, idx) => (
            <motion.path
              key={`leaf-${idx}`}
              d={leaf.d}
              fill="url(#leafGrad)"
              opacity="0.8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 1, delay: leaf.delay, ease: "easeOut" }}
              style={{ transformOrigin: "200px 420px" }}
            />
          ))}

          {/* 3. TALLOS CRECIENDO ORGÁNICAMENTE HACIA LAS 13 FLORES */}
          {FLOWERS.map((flower) => {
            const isBloomed = revealedIds.includes(flower.id);
            return (
              <motion.path
                key={`stem-${flower.id}`}
                d={flower.stemD}
                fill="none"
                stroke="url(#emeraldStem)"
                strokeWidth={isBloomed ? "3.5" : "2.2"}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: flower.id * 0.06, ease: "easeInOut" }}
              />
            );
          })}

          {/* 4. LAZO DE SATÉN DORADO EN LA BASE */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            transform="translate(200, 475)"
          >
            {/* Lazo izquierdo y derecho */}
            <path
              d="M-30,-5 C-50,-25 -20,-30 0,-10 C20,-30 50,-25 30,-5 Z"
              fill="url(#goldRibbon)"
            />
            {/* Cintas colgantes */}
            <path
              d="M-8,0 Q-25,35 -35,50 M8,0 Q25,35 35,50"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Nudo central */}
            <circle cx="0" cy="-7" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          </motion.g>

          {/* 5. LAS 13 FLORES BOTÁNICAS LUMINOSAS */}
          {FLOWERS.map((flower) => (
            <FlowerGraphic
              key={flower.id}
              flower={flower}
              isBloomed={revealedIds.includes(flower.id)}
              onClick={() => handleOpenFlower(flower)}
            />
          ))}
        </svg>
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
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl text-3xl"
                style={{
                  background: `linear-gradient(135deg, ${activeFlower.colorStart}, ${activeFlower.colorEnd})`,
                  boxShadow: `0 0 26px ${activeFlower.glowRgba}`,
                }}
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
                {FLOWERS.map((flower) => (
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
