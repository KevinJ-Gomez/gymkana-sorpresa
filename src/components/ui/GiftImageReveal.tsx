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
        <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/30 bg-white/5 p-6 text-center text-white/70">
          <ImageOff className="h-10 w-10" />
          <p className="text-sm">
            Añade tu imagen en <code className="rounded bg-black/30 px-1.5 py-0.5">public{src}</code>
          </p>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="aspect-square w-full rounded-2xl object-cover shadow-lg"
        />
      )}
      {caption && (
        <figcaption className="mt-3 text-center text-sm italic text-white/80">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
