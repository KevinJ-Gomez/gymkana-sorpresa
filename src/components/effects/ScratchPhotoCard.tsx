"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { hapticScratch, hapticSuccess } from "@/lib/haptics";

interface ScratchPhotoCardProps {
  imageSrc: string;
  altText: string;
  onRevealed?: () => void;
}

export function ScratchPhotoCard({ imageSrc, altText, onRevealed }: ScratchPhotoCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const isDrawing = useRef(false);
  const lastHaptic = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isFullyRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar resolución del canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Pintar fondo dorado metalizado con textura de purpurina
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#fbbf24");
    grad.addColorStop(0.3, "#fef08a");
    grad.addColorStop(0.5, "#f59e0b");
    grad.addColorStop(0.7, "#fef08a");
    grad.addColorStop(1, "#d97706");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Patrón decorativo de destellos
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      const rSize = 1.5 + Math.random() * 2.5;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Texto instructivo sobre la tarjeta
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("¡Rasca aquí con tu dedo!", canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = "12px sans-serif";
    ctx.fillText("Desliza para desvelar la foto", canvas.width / 2, canvas.height / 2 + 15);
  }, [isFullyRevealed]);

  function scratch(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas || isFullyRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!hasStarted) setHasStarted(true);

    const now = Date.now();
    if (now - lastHaptic.current > 80) {
      hapticScratch();
      lastHaptic.current = now;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    checkScratchedPercentage();
  }

  function checkScratchedPercentage() {
    const canvas = canvasRef.current;
    if (!canvas || isFullyRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      const totalPixels = data.length / 4;

      for (let i = 3; i < data.length; i += 64) {
        if (data[i] === 0) transparentPixels++;
      }

      const ratio = transparentPixels / (totalPixels / 16);
      if (ratio > 0.42) {
        setIsFullyRevealed(true);
        hapticSuccess();
        if (onRevealed) onRevealed();
      }
    } catch {
      // Silencioso
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  }

  function handlePointerUp() {
    isDrawing.current = false;
  }

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-pink-400/30 bg-black/40 shadow-2xl">
      {/* 1. Foto real del regalo */}
      <div className="relative aspect-square w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={altText}
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        {/* Fallback de reserva */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-rose-950/80 to-purple-950/80 p-6 text-center text-white">
          <Heart className="mb-2 h-10 w-10 text-pink-400 fill-pink-400 animate-pulse" />
          <p className="text-base font-semibold">{altText}</p>
          <p className="mt-1 text-xs text-pink-200/70">Foto del regalo preparada</p>
        </div>
      </div>

      {/* 2. Capa de Rascar Interactiva */}
      <AnimatePresence>
        {!isFullyRevealed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0 z-10 touch-none"
          >
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="h-full w-full cursor-pointer"
            />
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0], x: [-20, 20, -20] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-pink-300" />
                Rasca con el dedo
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Indicador de Desvelado */}
      {isFullyRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 px-4 py-2.5 text-center border-t border-white/10"
        >
          <p className="text-xs font-semibold text-pink-300 flex items-center justify-center gap-1">
            <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
            ¡Regalo al descubierto!
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default ScratchPhotoCard;

