"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCcw, Image as ImageIcon } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";
import { hapticTap, hapticSuccess } from "@/lib/haptics";

const COLS = 2;
const ROWS = 3;
const TOTAL_PIECES = COLS * ROWS; // 6 piezas

interface PieceData {
  id: number;
  row: number;
  col: number;
}

const PIECES: PieceData[] = Array.from({ length: TOTAL_PIECES }, (_, i) => ({
  id: i,
  row: Math.floor(i / COLS),
  col: i % COLS,
}));

/**
 * Día 10: Rompecabezas del Cuadro
 * Reconstrucción interactiva en cuadrícula 2x3. Al completar las 6 piezas,
 * se devela la foto enmarcada y el mensaje directo de recogida.
 */
export function Day10({ config, isUnlocked, onUnlock }: DayComponentProps) {
  // Piezas colocadas en el marco (array de ids: 0..5)
  const [placedPieces, setPlacedPieces] = useState<number[]>(() =>
    isUnlocked ? [0, 1, 2, 3, 4, 5] : []
  );

  // Orden desordenado de la bandeja de piezas
  const [trayOrder, setTrayOrder] = useState<number[]>([3, 0, 5, 1, 4, 2]);

  // Control de carga de la imagen del cuadro (fallback si /images/cuadro.jpg no existe aún)
  const [imgSrc, setImgSrc] = useState<string>(
    config.imageSrc || "/images/cuadro.jpg"
  );

  // Comprobar si la imagen falla y cargar recuerdo de muestra de la galería
  const handleImageError = () => {
    if (imgSrc !== "/gallery/3_viajes/1.jpg") {
      setImgSrc("/gallery/3_viajes/1.jpg");
    }
  };

  const isCompleted = placedPieces.length === TOTAL_PIECES || isUnlocked;

  // Piezas restantes en la bandeja
  const remainingInTray = useMemo(() => {
    return trayOrder.filter((id) => !placedPieces.includes(id));
  }, [trayOrder, placedPieces]);

  // Manejar colocación de una pieza
  const handlePlacePiece = (pieceId: number) => {
    if (placedPieces.includes(pieceId)) return;

    hapticTap();
    const nextPlaced = [...placedPieces, pieceId];
    setPlacedPieces(nextPlaced);

    // ¿Se ha completado el cuadro?
    if (nextPlaced.length === TOTAL_PIECES) {
      hapticSuccess();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#be185d", "#f472b6", "#fbbf24", "#fff8fa"],
      });
      onUnlock?.();
    }
  };

  const handleResetPuzzle = () => {
    hapticTap();
    setPlacedPieces([]);
    // Barajar de nuevo la bandeja
    setTrayOrder((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="space-y-6 text-center select-none">
      {/* Precarga silenciosa para detectar si la imagen existe */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt="Preload"
        className="hidden"
        onError={handleImageError}
      />

      {/* ========================================================= */}
      {/* CASO: CUADRO COMPLETADO O DESBLOQUEADO                   */}
      {/* ========================================================= */}
      {isCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          {/* MARCO ARTÍSTICO ELEGANTE (Lienzo con moldura) */}
          <div className="relative mx-auto max-w-[320px] rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#e5d5b7] via-[#c4a47c] to-[#9c7a4e] shadow-[0_12px_36px_rgba(74,29,46,0.22)] border border-[#f5ebd7]">
            {/* Paspartú interior blanco/marfil */}
            <div className="relative rounded-2xl p-3 bg-[#fffbf7] shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] border border-[#e8dcc8]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt="Nuestros mejores recuerdos"
                  className="h-full w-full object-cover object-center"
                />
                {/* Brillo sutil de cristal sobre el cuadro */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25" />
              </div>
            </div>
          </div>

          {/* TEXTO EXACTO SOLICITADO */}
          <div className="space-y-2 px-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#4a1d2e] leading-snug">
              Nuestros mejores recuerdos merecen estar en la pared
            </h3>
            <p className="text-sm sm:text-base font-serif italic text-[#831843]">
              Tendrás que ir a recogerlo 🖼️
            </p>
          </div>

          {/* Botón para volver a jugar el puzzle si se quiere repetir */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleResetPuzzle}
              className="inline-flex items-center gap-1.5 rounded-full border border-petal-300/50 bg-[#faf0f4] px-4 py-2 text-xs font-serif text-[#9d5272] transition hover:bg-[#fce7f3] active:scale-95 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Volver a armar el puzzle</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* ========================================================= */
        /* CASO: PUZZLE EN CURSO (6 PIEZAS INTERACTIVAS)             */
        /* ========================================================= */
        <div className="space-y-5">
          {/* Instrucción breve */}
          <div className="space-y-1">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#4a1d2e]">
              El Rompecabezas del Cuadro
            </h4>
            <p className="text-xs sm:text-sm font-serif italic text-[#831843]">
              Toca cada pieza para reconstruir este recuerdo juntos ({placedPieces.length} de {TOTAL_PIECES})
            </p>
          </div>

          {/* MARCO PRINCIPAL DONDE SE ENCAJAN LAS PIEZAS */}
          <div className="relative mx-auto max-w-[300px] rounded-3xl p-3 bg-gradient-to-b from-[#e5d5b7] via-[#c4a47c] to-[#9c7a4e] shadow-[0_10px_30px_rgba(74,29,46,0.18)] border border-[#f5ebd7]">
            <div className="relative rounded-2xl p-2.5 bg-[#fffbf7] shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)]">
              {/* Cuadrícula 2 columnas x 3 filas */}
              <div className="grid grid-cols-2 grid-rows-3 gap-1 aspect-[4/5] w-full rounded-lg overflow-hidden bg-[#faf0f4] border border-petal-200/50">
                {PIECES.map((piece) => {
                  const isPlaced = placedPieces.includes(piece.id);

                  return (
                    <div
                      key={piece.id}
                      onClick={() => {
                        if (!isPlaced) {
                          handlePlacePiece(piece.id);
                        }
                      }}
                      className={`relative flex items-center justify-center transition-all ${
                        isPlaced
                          ? "shadow-inner cursor-default"
                          : "border border-dashed border-petal-300/60 bg-[#fff8fa] hover:bg-petal-100/40 cursor-pointer"
                      }`}
                      style={{
                        ...(isPlaced
                          ? {
                              backgroundImage: `url(${imgSrc})`,
                              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                              backgroundPosition: `${(piece.col / (COLS - 1)) * 100}% ${(piece.row / (ROWS - 1)) * 100}%`,
                            }
                          : {}),
                      }}
                    >
                      {!isPlaced && (
                        <div className="flex flex-col items-center justify-center text-petal-300/80">
                          <ImageIcon className="h-4 w-4 mb-0.5 opacity-40 text-[#be185d]" />
                          <span className="text-[10px] font-mono font-semibold text-[#9d5272]">
                            #{piece.id + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BANDEJA DE PIEZAS SUELTAS */}
          <div className="rounded-2xl border border-petal-300/40 bg-[#faf0f4]/80 p-4 space-y-2.5 shadow-xs">
            <span className="text-[11px] font-serif uppercase tracking-wider text-[#9d5272] block font-semibold">
              Piezas por colocar (Toca para encajar)
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {remainingInTray.map((pieceId) => {
                const piece = PIECES[pieceId];

                return (
                  <motion.button
                    key={pieceId}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handlePlacePiece(pieceId)}
                    className="group relative h-16 w-14 sm:h-20 sm:w-16 rounded-xl border-2 border-[#be185d]/60 shadow-md overflow-hidden cursor-pointer active:brightness-110"
                    style={{
                      backgroundImage: `url(${imgSrc})`,
                      backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                      backgroundPosition: `${(piece.col / (COLS - 1)) * 100}% ${(piece.row / (ROWS - 1)) * 100}%`,
                    }}
                    title={`Colocar pieza #${pieceId + 1}`}
                  >
                    <div className="absolute inset-0 bg-black/10 transition group-hover:bg-transparent" />
                    <span className="absolute bottom-1 right-1 rounded-full bg-[#1e0a2b]/80 px-1.5 py-0.5 text-[9px] font-mono text-white">
                      #{pieceId + 1}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Day10;
