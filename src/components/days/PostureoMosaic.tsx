"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PostureoMosaicProps {
  images: string[];
  text: string;
  isPaused?: boolean;
}

export function PostureoMosaic({
  images,
  text = "muchos outfits y espejos , tantos que no me cabían todas las fotos...",
  isPaused = false,
}: PostureoMosaicProps) {
  // Índice de la foto que se está destacando en primer plano
  const [currentIndex, setCurrentIndex] = useState(0);
  const isFinished = currentIndex >= images.length;

  useEffect(() => {
    if (isPaused || isFinished) return;

    // Velocidad 2.2x (aprox 500ms por foto para que sea dinámico y no se haga pesado)
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < images.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 520);

    return () => clearInterval(interval);
  }, [isPaused, isFinished, images.length]);

  return (
    <div className="relative flex h-full w-full max-w-4xl flex-col items-center justify-center p-3 select-none overflow-hidden">
      {/* 1. MOSAICO DE FONDO: Las fotos que ya han aparecido se van colocando detrás */}
      <div className="w-full max-w-2xl grid grid-cols-6 sm:grid-cols-8 gap-1.5 sm:gap-2 justify-items-center items-center">
        {images.map((src, index) => {
          const isPlaced = index < currentIndex;
          const isCurrent = index === currentIndex && !isFinished;

          return (
            <motion.div
              key={src}
              initial={false}
              animate={{
                opacity: isPlaced ? 0.95 : 0.08,
                scale: isPlaced ? 1 : 0.85,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Outfit ${index + 1}`}
                className="h-full w-full object-cover object-center transition-all duration-300"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              {/* Resplandor cuando se acaba de colocar */}
              {isPlaced && (
                <div className="pointer-events-none absolute inset-0 border border-white/20 rounded-lg" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 2. FOTO PRINCIPAL EN PRIMER PLANO (Aparece grande como las demás y luego pasa al fondo) */}
      <AnimatePresence mode="wait">
        {!isFinished && images[currentIndex] && (
          <motion.div
            key={images[currentIndex]}
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.4,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="pointer-events-none absolute z-30 flex items-center justify-center p-4 max-h-[65vh] max-w-[85vw]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt="Foto Postureo"
              className="max-h-[55vh] max-w-[80vw] sm:max-w-md rounded-2xl object-contain shadow-[0_15px_40px_rgba(0,0,0,0.9)] border-2 border-pink-400/40 backdrop-blur-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. TEXTO INFERIOR: Aparece cuando el mosaico entero con las 31 fotos está colocado */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-5 px-6 text-center max-w-xl z-20"
          >
            <p className="font-serif text-lg sm:text-2xl font-medium italic leading-relaxed text-pink-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              “{text}”
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PostureoMosaic;
