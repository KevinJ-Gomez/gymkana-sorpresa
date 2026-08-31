"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, Heart, Sparkles } from "lucide-react";
import { hapticTap } from "@/lib/haptics";

interface InteractivePolaroidProps {
  imageSrc?: string;
  caption?: string;
  secretNote?: string;
}

export function InteractivePolaroid({
  imageSrc = "/gallery/6_felicidad/23.jpg",
  caption,
  secretNote = "Busca detrás de la funda de mi móvil",
}: InteractivePolaroidProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  function handleFlip() {
    setIsFlipped(!isFlipped);
    hapticTap();
  }

  return (
    <div className="flex flex-col items-center py-2">
      {/* Contenedor 3D Flip */}
      <div
        className="relative h-[380px] w-[290px] sm:h-[410px] sm:w-[310px] cursor-pointer select-none [perspective:1000px]"
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="relative h-full w-full rounded-2xl [transform-style:preserve-3d] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* ================= CARA FRONTAL (FOTO POLAROID LIMPIA) ================= */}
          <div className="absolute inset-0 flex flex-col rounded-2xl bg-[#fcfbf9] p-4 text-zinc-800 [backface-visibility:hidden] border border-zinc-200">
            {/* Foto cuadrada */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-200 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Foto Polaroid"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Parte inferior de la Polaroid con botón girar */}
            <div className="mt-auto flex flex-col items-center justify-center pb-1 text-center">
              {caption && (
                <p className="font-serif text-sm italic text-zinc-700 tracking-wide mb-1">
                  {caption}
                </p>
              )}
              <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-500 hover:bg-zinc-200 transition">
                <RotateCw className="h-3 w-3" />
                Toca para dar la vuelta
              </span>
            </div>
          </div>

          {/* ================= CARA TRASERA (MENSAJE SECRETO) ================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]
              bg-[#f5ebd7] border-2 border-[#e5d5b7] shadow-inner"
          >
            {/* Cabecera trasera */}
            <div className="flex items-center gap-1 text-amber-900/60 text-xs font-semibold uppercase tracking-widest pt-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Pista Secreta
            </div>

            {/* Mensaje secreto central manuscrito */}
            <div className="my-auto space-y-3 px-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 shadow-sm">
                <Heart className="h-5 w-5 fill-rose-500" />
              </div>
              <p className="font-serif text-xl font-bold leading-relaxed text-zinc-900 italic">
                “{secretNote}”
              </p>
            </div>

            {/* Pie trasero */}
            <div className="w-full border-t border-amber-900/15 pt-3 pb-1">
              <p className="text-xs font-medium text-zinc-600">
                Con todo mi amor ❤️
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-zinc-400">
                <RotateCw className="h-2.5 w-2.5" />
                Toca para volver a la foto
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InteractivePolaroid;
