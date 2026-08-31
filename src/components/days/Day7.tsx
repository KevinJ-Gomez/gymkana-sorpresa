"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, BookOpen, ChevronRight, Flower2, Check } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";
import { hapticTap, hapticSuccess } from "@/lib/haptics";

interface FlowerData {
  id: number;
  cx: number;
  cy: number;
  stemD: string;
  name: string;
  colorStart: string;
  colorMid: string;
  colorEnd: string;
  glowRgba: string;
  text: string;
}

// 13 ROSAS PRINCIPALES DEL RAMO CON SUS TALLOS Y DEDICATORIAS
const FLOWERS: FlowerData[] = [
  {
    id: 1,
    cx: 200,
    cy: 70,
    stemD: "M200,440 Q200,250 200,70",
    name: "Gran Rosa Eterna",
    colorStart: "#ff2a6d",
    colorMid: "#e11d48",
    colorEnd: "#881337",
    glowRgba: "rgba(255, 42, 109, 0.9)",
    text: "Amo todos los besos que me das a diario y todas las veces que me pides que te dé más.",
  },
  {
    id: 2,
    cx: 125,
    cy: 95,
    stemD: "M200,440 Q160,260 125,95",
    name: "Rosa Blush Romántica",
    colorStart: "#f472b6",
    colorMid: "#db2777",
    colorEnd: "#9d174d",
    glowRgba: "rgba(244, 114, 182, 0.9)",
    text: "Amo cuidarte, mimarte y consentirte cada vez que puedo.",
  },
  {
    id: 3,
    cx: 275,
    cy: 95,
    stemD: "M200,440 Q240,260 275,95",
    name: "Rosa Orquídea Púrpura",
    colorStart: "#c084fc",
    colorMid: "#9333ea",
    colorEnd: "#581c87",
    glowRgba: "rgba(192, 132, 252, 0.9)",
    text: "Amo que tú también me cuides y me mimes cuando puedes.",
  },
  {
    id: 4,
    cx: 65,
    cy: 145,
    stemD: "M200,440 Q130,290 65,145",
    name: "Rosa Oro Cálido",
    colorStart: "#fde047",
    colorMid: "#f59e0b",
    colorEnd: "#b45309",
    glowRgba: "rgba(253, 224, 71, 0.9)",
    text: "Amo la buena persona que eres y que me haces ser.",
  },
  {
    id: 5,
    cx: 335,
    cy: 145,
    stemD: "M200,440 Q270,290 335,145",
    name: "Rosa Silvestre Carmesí",
    colorStart: "#fb7185",
    colorMid: "#e11d48",
    colorEnd: "#9f1239",
    glowRgba: "rgba(251, 113, 133, 0.9)",
    text: "Amo cada comida que me preparas con esfuerzo y amor.",
  },
  {
    id: 6,
    cx: 140,
    cy: 175,
    stemD: "M200,440 Q170,300 140,175",
    name: "Rosa Ámbar Aterciopelada",
    colorStart: "#fbbf24",
    colorMid: "#ea580c",
    colorEnd: "#9a3412",
    glowRgba: "rgba(251, 191, 36, 0.9)",
    text: "Amo lo orgulloso que me haces sentir de tenerte y lo bien que me siento al hablar de ti.",
  },
  {
    id: 7,
    cx: 260,
    cy: 175,
    stemD: "M200,440 Q230,300 260,175",
    name: "Rosa Amatista Profunda",
    colorStart: "#e879f9",
    colorMid: "#c026d3",
    colorEnd: "#701a75",
    glowRgba: "rgba(232, 121, 249, 0.9)",
    text: "Amo lo bien que hablas de mí a otros.",
  },
  {
    id: 8,
    cx: 200,
    cy: 225,
    stemD: "M200,440 Q200,320 200,225",
    name: "Rosa Rubí Central",
    colorStart: "#f43f5e",
    colorMid: "#be123c",
    colorEnd: "#4c0519",
    glowRgba: "rgba(244, 63, 94, 0.95)",
    text: "Amo la forma en que me respetas a mí y cuidas nuestra relación.",
  },
  {
    id: 9,
    cx: 85,
    cy: 250,
    stemD: "M200,440 Q145,340 85,250",
    name: "Rosa Fucsia Radiante",
    colorStart: "#f472b6",
    colorMid: "#be185d",
    colorEnd: "#831843",
    glowRgba: "rgba(244, 114, 182, 0.9)",
    text: "Amo cada vez que te acuerdas de mí y tienes detalles conmigo.",
  },
  {
    id: 10,
    cx: 315,
    cy: 250,
    stemD: "M200,440 Q255,340 315,250",
    name: "Rosa Celeste Etérea",
    colorStart: "#38bdf8",
    colorMid: "#0284c7",
    colorEnd: "#075985",
    glowRgba: "rgba(56, 189, 248, 0.9)",
    text: "Amo a mi futura mujer.",
  },
  {
    id: 11,
    cx: 135,
    cy: 310,
    stemD: "M200,440 Q170,370 135,310",
    name: "Rosa Coral Iluminada",
    colorStart: "#fb923c",
    colorMid: "#e11d48",
    colorEnd: "#9f1239",
    glowRgba: "rgba(251, 146, 60, 0.9)",
    text: "Amo la forma en la que cuidas a tu familia y sobre todo a tu hermano.",
  },
  {
    id: 12,
    cx: 265,
    cy: 310,
    stemD: "M200,440 Q230,370 265,310",
    name: "Rosa de Fuego Intensa",
    colorStart: "#f87171",
    colorMid: "#dc2626",
    colorEnd: "#7f1d1d",
    glowRgba: "rgba(248, 113, 113, 0.9)",
    text: "Amo cada parte de tu cuerpo.",
  },
  {
    id: 13,
    cx: 200,
    cy: 355,
    stemD: "M200,440 L200,355",
    name: "Rosa Pasión Secreta",
    colorStart: "#fb7185",
    colorMid: "#f59e0b",
    colorEnd: "#ea580c",
    glowRgba: "rgba(251, 113, 133, 0.95)",
    text: "Amo darte cachetes en el culo y otras cosas... cuando te agachas.",
  },
];

// FLORES DECORATIVAS DE RELLENO (Paniculata y jazmines)
const FILLER_BLOOMS = [
  { cx: 165, cy: 80, r: 6, color: "#fdf2f8" },
  { cx: 235, cy: 80, r: 5.5, color: "#fef9c3" },
  { cx: 90, cy: 110, r: 6, color: "#fce7f3" },
  { cx: 310, cy: 110, r: 6, color: "#fdf4ff" },
  { cx: 175, cy: 130, r: 6.5, color: "#fce7f3" },
  { cx: 225, cy: 130, r: 6.5, color: "#ecfeff" },
  { cx: 100, cy: 180, r: 6, color: "#fff1f2" },
  { cx: 300, cy: 180, r: 6, color: "#fdf2f8" },
  { cx: 160, cy: 230, r: 5.5, color: "#fef3c7" },
  { cx: 240, cy: 230, r: 5.5, color: "#fce7f3" },
  { cx: 110, cy: 280, r: 6, color: "#fdf4ff" },
  { cx: 290, cy: 280, r: 6, color: "#fdf2f8" },
  { cx: 165, cy: 330, r: 5, color: "#fef9c3" },
  { cx: 235, cy: 330, r: 5, color: "#fff1f2" },
  { cx: 50, cy: 180, r: 5.5, color: "#fce7f3" },
  { cx: 350, cy: 180, r: 5.5, color: "#fdf4ff" },
  { cx: 60, cy: 220, r: 5, color: "#fdf2f8" },
  { cx: 340, cy: 220, r: 5, color: "#fff1f2" },
];

/**
 * Gráfico individual de cada Rosa principal botánica que florece y se abre
 */
function FlowerGraphicNode({
  flower,
  isBloomed,
  isTarget,
  isLocked,
  onClick,
}: {
  flower: FlowerData;
  isBloomed: boolean;
  isTarget: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  const gradId = `rose-grad-${flower.id}`;
  const innerGradId = `rose-inner-${flower.id}`;
  const glowId = `rose-glow-${flower.id}`;

  return (
    <g
      transform={`translate(${flower.cx}, ${flower.cy})`}
      className={`cursor-pointer select-none transition-all ${
        isLocked ? "opacity-60 hover:opacity-85" : "opacity-100"
      }`}
      onClick={onClick}
    >
      <defs>
        <radialGradient id={gradId} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={flower.colorStart} />
          <stop offset="60%" stopColor={flower.colorMid} />
          <stop offset="100%" stopColor={flower.colorEnd} />
        </radialGradient>
        <radialGradient id={innerGradId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="40%" stopColor={flower.colorStart} />
          <stop offset="100%" stopColor={flower.colorMid} />
        </radialGradient>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={isTarget ? "7" : isBloomed ? "4" : "1.5"} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Halo de Guía Activa para la rosa que toca abrir */}
      {isTarget && (
        <motion.circle
          r="28"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          animate={{
            r: [22, 32, 22],
            opacity: [1, 0.25, 1],
            strokeWidth: [3, 1, 3],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Resplandor cálido de la flor */}
      <motion.circle
        r={isBloomed ? 28 : isTarget ? 22 : 14}
        fill={isTarget ? "#fbbf24" : flower.glowRgba}
        opacity={isTarget ? 0.6 : isBloomed ? 0.45 : 0.18}
        animate={{
          r: isTarget ? [20, 26, 20] : isBloomed ? [26, 30, 26] : [13, 16, 13],
          opacity: isTarget ? [0.5, 0.85, 0.5] : isBloomed ? [0.35, 0.6, 0.35] : [0.12, 0.25, 0.12],
        }}
        transition={{ duration: isTarget ? 1.2 : 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ================= ROSA EN CAPAS BOTÁNICAS ================= */}
      <motion.g
        initial={{ scale: 0.75 }}
        animate={{ scale: isBloomed ? 1.35 : isTarget ? 1.15 : 0.9 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        filter={`url(#${glowId})`}
      >
        {/* CAPA 1: Pétalos exteriores grandes y redondeados */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.path
            key={`outer-petal-${i}`}
            d="M0,0 C-14,-16 -16,-28 0,-32 C16,-28 14,-16 0,0 Z"
            fill={`url(#${gradId})`}
            opacity={isBloomed ? 0.98 : 0.8}
            transform={`rotate(${angle})`}
            stroke="#ffffff"
            strokeWidth={isBloomed ? "0.8" : isTarget ? "1" : "0.3"}
            strokeOpacity={isTarget ? "0.9" : "0.4"}
          />
        ))}

        {/* CAPA 2: Pétalos intermedios superpuestos (Rosa abierta) */}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => (
          <motion.path
            key={`mid-petal-${i}`}
            d="M0,0 C-10,-12 -12,-22 0,-25 C12,-22 10,-12 0,0 Z"
            fill={`url(#${innerGradId})`}
            opacity={isBloomed ? 0.95 : 0.7}
            transform={`rotate(${angle})`}
          />
        ))}

        {/* CAPA 3: Pétalos interiores de capullo en espiral */}
        {isBloomed &&
          [15, 75, 135, 195, 255, 315].map((angle, i) => (
            <motion.path
              key={`inner-petal-${i}`}
              d="M0,0 C-7,-8 -7,-16 0,-18 C7,-16 7,-8 0,0 Z"
              fill={flower.colorStart}
              transform={`rotate(${angle})`}
              opacity={0.92}
            />
          ))}

        {/* Centro de la Rosa: Pistilos dorados y corazón */}
        <circle r={isBloomed ? 9 : isTarget ? 8 : 5.5} fill="#ffffff" opacity={0.9} />
        <circle r={isBloomed ? 7 : isTarget ? 6 : 4} fill={isTarget ? "#fbbf24" : flower.colorStart} />
        {isBloomed && <circle r="3.5" fill="#fef08a" />}
      </motion.g>

      {/* Indicador Numérico o Corazón */}
      {!isBloomed ? (
        <text
          y="3.5"
          textAnchor="middle"
          fontSize={isTarget ? "11" : "9"}
          fontWeight="bold"
          fill="#ffffff"
          className="pointer-events-none drop-shadow"
        >
          {flower.id}
        </text>
      ) : (
        <Heart
          x="-5.5"
          y="-5.5"
          width="11"
          height="11"
          className="fill-white text-white drop-shadow pointer-events-none"
        />
      )}

      {/* Cartelito flotante '¡Toca #X!' para la rosa objetivo */}
      {isTarget && (
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="-26"
            y="-42"
            width="52"
            height="15"
            rx="7.5"
            fill="rgba(0,0,0,0.85)"
            stroke="#fbbf24"
            strokeWidth="1.2"
          />
          <text
            x="0"
            y="-31"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="bold"
            fill="#fde047"
            className="pointer-events-none"
          >
            ¡Toca #{flower.id}!
          </text>
        </motion.g>
      )}
    </g>
  );
}

/**
 * Componente Principal del Día 7: Ramo Frondoso, Grande y Colorido.
 */
export function Day7({ isUnlocked }: DayComponentProps) {
  const [hasStartedGrowth, setHasStartedGrowth] = useState(false);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [activeFlower, setActiveFlower] = useState<FlowerData | null>(null);
  const [showFullLetter, setShowFullLetter] = useState(false);

  if (!isUnlocked) return null;

  const nextTargetId = revealedIds.length < FLOWERS.length ? revealedIds.length + 1 : null;

  const handleOpenFlower = (flower: FlowerData) => {
    if (revealedIds.includes(flower.id)) {
      hapticTap();
      setActiveFlower(flower);
    } else if (flower.id === nextTargetId) {
      hapticSuccess();
      setActiveFlower(flower);
      setRevealedIds((prev) => [...prev, flower.id]);
    } else {
      const target = FLOWERS.find((f) => f.id === nextTargetId);
      if (target) {
        hapticSuccess();
        setActiveFlower(target);
        setRevealedIds((prev) => [...prev, target.id]);
      }
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
            <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
            <span>Un Regalo Especial</span>
            <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Lo que más amo de ti
          </h3>

          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-5 text-left space-y-3">
            <p className="text-sm sm:text-base leading-relaxed text-white/95 font-serif italic">
              “Hoy no hay un regalo físico... pero te he preparado un ramo frondoso y lleno de vida con las cosas que más me gustan de ti:”
            </p>
            <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed">
              Un <strong>ramo de rosas botánicas</strong> que irá floreciendo ante tus ojos. Sigue la luz dorada y toca cada rosa en orden (del 1 al 13) para descubrir qué me hace amarte cada día.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => {
              hapticTap();
              setHasStartedGrowth(true);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-6 py-4 font-semibold text-white shadow-2xl transition hover:brightness-110 flex items-center justify-center gap-2 text-base"
          >
            <span>Hacer florecer nuestro ramo</span>
            <Heart className="h-5 w-5 fill-current" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // FASE 2: RAMO FRONDOSO Y GRANDE
  // ==========================================
  return (
    <div className="relative flex flex-col items-center space-y-4 text-center select-none">
      {/* Barra de progreso superior */}
      <div className="w-full max-w-sm space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-pink-300 px-1">
          <span>Rosas abiertas: {revealedIds.length} / 13</span>
          <span>
            {isAllRevealed ? "¡Ramo completo! ❤️" : `Siguiente rosa: #${nextTargetId}`}
          </span>
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

      {/* LIENZO SVG: EL GRAN RAMO FRONDOSO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[390px] aspect-[4/5] rounded-3xl border border-white/20 bg-gradient-to-b from-[#180624] via-[#100318] to-[#08020c] overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.35)]"
      >
        {/* Resplandor nebuloso de fondo */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.75, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: `${230 + revealedIds.length * 12}px`,
            height: `${230 + revealedIds.length * 12}px`,
            background:
              "radial-gradient(circle, rgba(244,114,182,0.45) 0%, rgba(217,70,239,0.3) 40%, rgba(251,191,36,0.2) 70%, transparent 80%)",
          }}
        />

        <svg viewBox="0 0 400 520" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="emeraldStem" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
            <linearGradient id="eucalyptusLeaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            {/* Papel Kraft floral envolvente del ramo */}
            <linearGradient id="bouquetPaperFront" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4a373" />
              <stop offset="50%" stopColor="#bc6c25" />
              <stop offset="100%" stopColor="#6f3a14" />
            </linearGradient>
            <linearGradient id="bouquetPaperBack" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fefae0" />
              <stop offset="100%" stopColor="#dda15e" />
            </linearGradient>
          </defs>

          {/* 1. PAPEL FLORAL TRASERO DESPLEGADO (Da forma de ramo grande y abierto) */}
          <g opacity="0.85">
            <path
              d="M40,320 Q200,420 360,320 L240,490 L160,490 Z"
              fill="url(#bouquetPaperBack)"
              stroke="#fbbf24"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
          </g>

          {/* 2. HOLLAJE FRONDOSO Y EUCALIPTO (Integrado armoniosamente detrás del ramo) */}
          {[
            // Hojas laterales suaves bien integradas detrás de las rosas
            { d: "M130,320 Q60,260 50,220 Q85,210 140,290 Z", delay: 0.2 },
            { d: "M140,270 Q70,190 70,150 Q110,160 155,230 Z", delay: 0.3 },
            { d: "M270,320 Q340,260 350,220 Q315,210 260,290 Z", delay: 0.25 },
            { d: "M260,270 Q330,190 330,150 Q290,160 245,230 Z", delay: 0.35 },
            // Hojas intermedias
            { d: "M200,360 Q130,280 110,240 Q160,230 200,320 Z", delay: 0.4 },
            { d: "M200,360 Q270,280 290,240 Q240,230 200,320 Z", delay: 0.45 },
          ].map((leaf, idx) => (
            <motion.path
              key={`leaf-${idx}`}
              d={leaf.d}
              fill="url(#eucalyptusLeaf)"
              opacity="0.85"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 }}
              transition={{ duration: 0.8, delay: leaf.delay, ease: "easeOut" }}
              style={{ transformOrigin: "200px 440px" }}
            />
          ))}

          {/* 3. TALLOS BOTÁNICOS LUMINOSOS QUE CONVERGEN EN EL NUDO DEL RAMO */}
          {FLOWERS.map((flower) => {
            const isBloomed = revealedIds.includes(flower.id);
            const isTarget = flower.id === nextTargetId;

            return (
              <g key={`stem-group-${flower.id}`}>
                <motion.path
                  d={flower.stemD}
                  fill="none"
                  stroke="#022c22"
                  strokeWidth={isTarget ? "5" : isBloomed ? "4.5" : "3"}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: flower.id * 0.04, ease: "easeInOut" }}
                />
                <motion.path
                  d={flower.stemD}
                  fill="none"
                  stroke="url(#emeraldStem)"
                  strokeWidth={isTarget ? "3.5" : isBloomed ? "3" : "2"}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: flower.id * 0.04, ease: "easeInOut" }}
                />
              </g>
            );
          })}

          {/* 4. FLORES DECORATIVAS DE RELLENO (Paniculata blanca/rosada para dar frondosidad) */}
          {FILLER_BLOOMS.map((fb, idx) => (
            <motion.g
              key={`filler-${idx}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 }}
              transition={{ duration: 0.6, delay: 0.3 + (idx % 8) * 0.08 }}
              transform={`translate(${fb.cx}, ${fb.cy})`}
            >
              {/* Pétalos de flor silvestre de relleno */}
              {[0, 72, 144, 216, 288].map((rot, pIdx) => (
                <ellipse
                  key={pIdx}
                  cx="0"
                  cy={-fb.r * 0.9}
                  rx={fb.r * 0.55}
                  ry={fb.r * 0.8}
                  fill={fb.color}
                  transform={`rotate(${rot})`}
                  opacity="0.9"
                />
              ))}
              <circle r={fb.r * 0.45} fill="#f59e0b" />
            </motion.g>
          ))}

          {/* 5. PAPEL KRAFT ENVOLTORIO FRONTAL CON PLIEGUES ENVOLVENTES */}
          <g>
            {/* Pliegue izquierdo del papel */}
            <path
              d="M110,360 L200,480 L160,495 L90,380 Z"
              fill="url(#bouquetPaperFront)"
              stroke="#fbbf24"
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Pliegue derecho del papel */}
            <path
              d="M290,360 L200,480 L240,495 L310,380 Z"
              fill="url(#bouquetPaperFront)"
              stroke="#fbbf24"
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Cuerpo central del papel de ramo */}
            <path
              d="M130,370 Q200,410 270,370 L220,490 L180,490 Z"
              fill="url(#bouquetPaperBack)"
              stroke="#fbbf24"
              strokeWidth="1.2"
              strokeOpacity="0.6"
            />
          </g>

          {/* 6. LAZO DE SATÉN DORADO CON CAÍDA ELEGANTE */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            transform="translate(200, 460)"
          >
            {/* Caídas de la cinta */}
            <path
              d="M-6,0 Q-25,30 -35,55 M6,0 Q25,30 35,55"
              stroke="#f59e0b"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lazos laterales */}
            <path
              d="M-32,-6 C-54,-28 -20,-32 0,-10 C20,-32 54,-28 32,-6 Z"
              fill="url(#goldRibbon)"
              stroke="#d97706"
              strokeWidth="1.2"
            />
            <circle cx="0" cy="-8" r="8" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
          </motion.g>

          {/* 7. LAS 13 ROSAS PRINCIPALES INTERACTIVAS */}
          {FLOWERS.map((flower) => {
            const isBloomed = revealedIds.includes(flower.id);
            const isTarget = flower.id === nextTargetId;
            const isLocked = !isBloomed && !isTarget;

            return (
              <FlowerGraphicNode
                key={flower.id}
                flower={flower}
                isBloomed={isBloomed}
                isTarget={isTarget}
                isLocked={isLocked}
                onClick={() => handleOpenFlower(flower)}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Cierre cuando todas las 13 rosas han sido abiertas */}
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
            “13 rosas, 13 verdades y un millón de razones para quererte.”
          </p>

          <button
            type="button"
            onClick={() => setShowFullLetter(true)}
            className="w-full rounded-full bg-pink-500/30 border border-pink-400/50 py-2.5 text-xs font-semibold text-pink-200 transition hover:bg-pink-500/40 active:scale-95 flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Leer todas las dedicatorias juntas</span>
          </button>
        </motion.div>
      )}

      {/* MODAL 1: DETALLE DE CADA FLOR */}
      <AnimatePresence>
        {activeFlower && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setActiveFlower(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-b from-[#2a1036] to-[#12051b] p-6 text-center shadow-2xl space-y-4"
            >
              <button
                onClick={() => setActiveFlower(null)}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${activeFlower.colorStart}, ${activeFlower.colorEnd})`,
                }}
              >
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-pink-300">
                  Rosa #{activeFlower.id} de 13
                </span>
                <h4 className="font-serif text-xl font-bold text-white mt-0.5">
                  {activeFlower.name}
                </h4>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm">
                <p className="font-serif text-base sm:text-lg italic leading-relaxed text-pink-100">
                  “{activeFlower.text}”
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveFlower(null)}
                className="w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95 text-sm"
              >
                Guardar en el ramo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: TODAS LAS DEDICATORIAS JUNTAS */}
      <AnimatePresence>
        {showFullLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-lg"
            onClick={() => setShowFullLetter(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-b from-[#2a1036] to-[#12051b] p-6 text-left shadow-2xl"
            >
              <button
                onClick={() => setShowFullLetter(false)}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="border-b border-white/10 pb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-pink-300">
                  Ramo Completo
                </span>
                <h4 className="font-serif text-2xl font-bold text-white">
                  13 cosas que amo de ti
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                {FLOWERS.map((flower) => (
                  <div
                    key={flower.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-1 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/30 text-[10px] font-bold text-pink-200">
                        {flower.id}
                      </span>
                      <span className="text-xs font-semibold text-pink-300">
                        {flower.name}
                      </span>
                    </div>
                    <p className="font-serif text-sm italic text-white/95 pl-7">
                      “{flower.text}”
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowFullLetter(false)}
                  className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-2.5 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95 text-sm"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Day7;
