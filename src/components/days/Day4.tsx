"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Sparkles, CheckCircle2, RotateCcw, Image as ImageIcon } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

// 9 fragmentos que forman una frase completa y con sentido al ordenarse (cuadrícula 3x3)
const PUZZLE_PIECES = [
  { id: 0, text: "Tu novio no trama esto" },
  { id: 1, text: "completamente solo..." },
  { id: 2, text: "hay dos personas" },
  { id: 3, text: "muy cercanas a mi (y a ahora también a ti)" },
  { id: 4, text: "que hoy guardan" },
  { id: 5, text: "la pista secreta" },
  { id: 6, text: "del regalo especial" },
  { id: 7, text: "que con tanto amor" },
  { id: 8, text: "te han preparado 🎁" },
];

function shuffleArray(array: number[]): number[] {
  const shuffled = [...array];
  let isSorted = true;
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Asegurar que no empiece ya resuelto
  for (let i = 0; i < shuffled.length; i++) {
    if (shuffled[i] !== i) {
      isSorted = false;
      break;
    }
  }
  if (isSorted) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

/**
 * Día 4: Rompecabezas de frase coherente en 3x3 (9 piezas).
 * El usuario intercambia piezas para reconstruir el mensaje de las cómplices.
 */
export function Day4({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const [board, setBoard] = useState<number[]>(() =>
    shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8])
  );
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Comprobar si el puzzle está resuelto
  const isSolved = useMemo(() => {
    return board.every((pieceId, index) => pieceId === index);
  }, [board]);

  const handleTileClick = (index: number) => {
    if (isSolved || isUnlocked) return;

    if (selectedIdx === null) {
      // Primera pieza seleccionada
      setSelectedIdx(index);
    } else if (selectedIdx === index) {
      // Deseleccionar al volver a tocar la misma
      setSelectedIdx(null);
    } else {
      // Intercambiar las dos piezas
      const nextBoard = [...board];
      const temp = nextBoard[selectedIdx];
      nextBoard[selectedIdx] = nextBoard[index];
      nextBoard[index] = temp;

      setBoard(nextBoard);
      setSelectedIdx(null);
      setMoveCount((c) => c + 1);

      // Comprobar victoria
      const won = nextBoard.every((pieceId, idx) => pieceId === idx);
      if (won && onUnlock) {
        setTimeout(() => {
          onUnlock();
        }, 700);
      }
    }
  };

  const resetPuzzle = () => {
    setBoard(shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]));
    setSelectedIdx(null);
    setMoveCount(0);
  };

  // ==========================================
  // PANTALLA 2: RECOMPENSA DESBLOQUEADA
  // ==========================================
  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-7 text-center shadow-2xl backdrop-blur-xl"
      >
        {/* Glows decorativos */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          {/* Badge de complicidad familiar */}
          <div className="flex items-center justify-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-300 backdrop-blur-md">
            <Users className="h-4 w-4" />
            <span>Misión Familiar Desbloqueada</span>
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Título de la recompensa */}
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {config.rewardTitle || "¡Cómplices de hoy reveladas!"}
          </h3>

          {/* Foto de la Suegra y Cuñada con el regalo */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-2xl">
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.imageSrc || "/images/day4-complices.jpg"}
                alt="Mamá y hermana con el regalo"
                className="h-auto w-full object-cover rounded-xl transition hover:scale-105 duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              // Placeholder elegante en caso de que la foto aún no se haya copiado
              <div className="flex flex-col items-center justify-center p-8 text-center text-pink-200">
                <ImageIcon className="h-12 w-12 text-pink-400/70 mb-3 animate-pulse" />
                <p className="font-medium text-base text-white">
                  Foto de mamá y hermana con tu regalo
                </p>
                <p className="mt-1 text-xs text-white/60">
                  (Coloca tu foto en <code>public/images/day4-complices.jpg</code>)
                </p>
              </div>
            )}
            {config.imageCaption && (
              <div className="bg-black/60 px-4 py-2 text-center text-xs font-medium text-pink-200 backdrop-blur-md">
                {config.imageCaption}
              </div>
            )}
          </div>

          {/* Mensaje de la Misión para pedir la pista */}
          <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-4 text-center">
            <p className="text-sm sm:text-base leading-relaxed text-white/95 drop-shadow">
              {config.rewardDescription ||
                "Hay dos personas muy especiales que te han preparado algo. Busca a tu suegra y a tu cuñada y pídeles la pista de dónde se encuentra escondido el regalo que con tanto amor han elegido para ti."}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // PANTALLA 1: MINIJUEGO DEL ROMPECABEZAS (3x3)
  // ==========================================
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
        {config.riddle ||
          "Intercambia las piezas tocando una y luego otra para ordenar la frase con sentido:"}
      </p>

      {/* Cuadrícula del Puzzle 3x3 */}
      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto p-1">
        <AnimatePresence>
          {board.map((pieceId, index) => {
            const piece = PUZZLE_PIECES[pieceId];
            const isSelected = selectedIdx === index;
            const isInCorrectPlace = pieceId === index;

            return (
              <motion.button
                key={piece.id}
                layout
                type="button"
                onClick={() => handleTileClick(index)}
                whileTap={{ scale: 0.95 }}
                className={`relative flex aspect-[4/3] flex-col items-center justify-center p-2 rounded-xl border text-center transition-all select-none ${
                  isSelected
                    ? "border-pink-400 bg-pink-500/40 shadow-[0_0_20px_rgba(244,114,182,0.7)] ring-2 ring-pink-400 scale-105 z-10"
                    : isInCorrectPlace
                    ? "border-emerald-400/80 bg-emerald-500/25 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.35)] ring-1 ring-emerald-400/40"
                    : "border-white/15 bg-white/10 text-white/90 hover:bg-white/15 active:bg-white/20 backdrop-blur-md"
                }`}
              >
                <span className="text-[11px] sm:text-xs font-medium leading-snug tracking-tight text-white drop-shadow">
                  {piece.text}
                </span>
                {isInCorrectPlace && (
                  <CheckCircle2 className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-emerald-300 drop-shadow" />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Barra de estado y reset */}
      <div className="flex items-center justify-between max-w-sm mx-auto px-2 pt-1 text-xs text-white/60">
        <span>Movimientos: {moveCount}</span>
        <button
          type="button"
          onClick={resetPuzzle}
          className="flex items-center gap-1 hover:text-white transition active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Barajar de nuevo</span>
        </button>
      </div>
    </div>
  );
}

export default Day4;
