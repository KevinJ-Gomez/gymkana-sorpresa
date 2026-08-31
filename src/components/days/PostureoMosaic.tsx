"use client";

import { motion } from "framer-motion";
import { Sparkles, Camera } from "lucide-react";

interface PostureoMosaicProps {
  images: string[];
  text: string;
}

export function PostureoMosaic({
  images,
  text = "muchos outfits y espejos , tantos que no me cabían todas las fotos...",
}: PostureoMosaicProps) {
  return (
    <div className="flex flex-col items-center justify-center p-2 max-w-2xl mx-auto w-full select-none">
      {/* Contenedor del Mosaico */}
      <div className="relative w-full rounded-2xl border border-pink-500/25 bg-black/50 p-2.5 sm:p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between px-1 text-pink-300/80 text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <Camera className="h-3.5 w-3.5 text-pink-400" />
            Colección de Espejos ({images.length} fotos)
          </span>
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
        </div>

        {/* Grid rápido de 31 fotos (6 columnas en móvil, 8 en tablet/PC) */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 sm:gap-1.5 max-h-[58vh] overflow-y-auto p-1 rounded-xl">
          {images.map((src, index) => (
            <motion.div
              key={src}
              initial={{ scale: 0, opacity: 0, rotate: (index % 5 - 2) * 4 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: index * 0.045, // Cascada ultra rápida: todas en 1.4s
                duration: 0.22,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              className="relative aspect-square overflow-hidden rounded-md border border-white/20 bg-zinc-900 shadow-md cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Postureo ${index + 1}`}
                className="h-full w-full object-cover object-center"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Texto inferior que aparece tras formarse el mosaico completo */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
        className="mt-3.5 px-4 text-center"
      >
        <p className="font-serif text-base sm:text-lg italic leading-relaxed text-pink-200 drop-shadow-md">
          “{text}”
        </p>
      </motion.div>
    </div>
  );
}

export default PostureoMosaic;
