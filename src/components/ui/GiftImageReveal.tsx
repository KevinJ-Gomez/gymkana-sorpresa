"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";

/**
 * Muestra una imagen de /public con una entrada animada. Si el fichero no
 * existe todavía (regalo real pendiente de subir la foto), cae a un
 * placeholder elegante en vez de romper el layout.
 */
export function GiftImageReveal({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-sm"
    >
      {failed ? (
        <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-petal-300/60 bg-[#faf0f4] p-6 text-center text-[#9d5272]">
          <ImageOff className="h-10 w-10 text-[#be185d]/60" />
          <p className="text-sm font-serif text-[#4a1d2e]">
            Añade tu imagen en <code className="rounded bg-petal-200/50 px-1.5 py-0.5 text-[#4a1d2e]">public{src}</code>
          </p>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="aspect-square w-full rounded-2xl object-cover shadow-lg border border-petal-300/40"
        />
      )}
      {caption && (
        <figcaption className="mt-3 text-center text-sm font-serif italic text-[#4a1d2e]/85">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
