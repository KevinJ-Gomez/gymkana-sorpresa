"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Sparkles, CheckCircle2, RotateCcw, Image as ImageIcon } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

// Configuración de las 6 piezas del rompecabezas
const PUZZLE_PIECES = [
  { id: 0, label: "1", emoji: "🤫", hint: "Misión" },
  { id: 1, label: "2", emoji: "🕵️‍♀️", hint: "Dos" },
  { id: 2, label: "3", emoji: "👩‍👧", hint: "Cómplices" },
  { id: 3, label: "4", emoji: "🎁", hint: "Tienen" },
  { id: 4, label: "5", emoji: "🗝️", hint: "Tu" },
  { id: 5, label: "6", emoji: "🎉", hint: "Regalo" },
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
 * Día 4: Rompecabezas de "Dos Cómplices".
 * Al resolver el puzzle táctil, se desbloquea la tarjeta con la foto de
 * su suegra y su cuñada y la instrucción para pedirles la pista del regalo.
 */
export function Day4({ config, isUnlocked, onUnlock }: DayComponentProps) {
  // Estado del puzzle: posiciones actuales de las piezas
  const [board, setBoard] = useState<number[]>(() =>
    shuffleArray([0, 1, 2, 3, 4, 5])
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
        }, 600);
      }
    }
  };

  const resetPuzzle = () => {
    setBoard(shuffleArray([0, 1, 2, 3, 4, 5]));
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
            {config.rewardTitle || "¡Cómplices Reveladas!"}
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
                "Hay dos personas muy especiales con una misión secreta para ti. Busca a tu suegra y a tu cuñada y pídeles la pista de dónde se encuentra escondido tu regalo."}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // PANTALLA 1: MINIJUEGO DEL ROMPECABEZAS
  // ==========================================
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm sm:text-base text-white/90 leading-relaxed">
        {config.riddle ||
          "Toca dos piezas para intercambiarlas de lugar y ordenar la secuencia del 1 al 6:"}
      </p>

      {/* Cuadrícula del Puzzle 3x2 */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-sm mx-auto p-1">
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
                className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border transition-all select-none ${
                  isSelected
                    ? "border-pink-400 bg-pink-500/30 shadow-[0_0_20px_rgba(244,114,182,0.6)] ring-2 ring-pink-400 scale-105 z-10"
                    : isInCorrectPlace
                    ? "border-emerald-400/40 bg-emerald-500/15 text-white"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-0.5">{piece.emoji}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-200">
                  {piece.hint}
                </span>
                <span className="absolute top-1.5 left-2 text-[10px] font-mono text-white/50">
                  #{piece.label}
                </span>
                {isInCorrectPlace && (
                  <CheckCircle2 className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-emerald-300" />
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
