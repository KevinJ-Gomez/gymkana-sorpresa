"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, RefreshCw, Box } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";
import { useDay1Photo } from "@/lib/storage";
import { hapticTap, hapticSuccess } from "@/lib/haptics";

/**
 * Día 1: El engaño de la Batería MagSafe + Funda y la Revelación del Accesorio / iPhone
 *
 * Flujo narrativo:
 * 1. Al desbloquear el día mediante la clave de la batería, se muestra el regalo
 *    inicial (Batería portátil con MagSafe + Funda especial).
 * 2. Se le pide subir una foto del regalo con la excusa de verificar el reto y ver el plan de hoy.
 * 3. Al subir la foto, se muestra en formato polaroid y se devela la segunda pista:
 *    "Te falta todavía un accesorio importante para complementar bien los 2 que acabas de recibir:
 *     ¡Busca en la caja de zapatos que tienes encima del armario!"
 */
export function Day1({ config, isUnlocked }: DayComponentProps) {
  const { photo, setPhoto } = useDay1Photo();
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUnlocked) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    hapticTap();
    setCompressing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar para evitar exceder los límites de localStorage
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
        setPhoto(compressedDataUrl);
        setCompressing(false);
        hapticSuccess();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    hapticTap();
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-center"
    >
      {/* 1. Descripción del regalo inicial (Batería + Funda) */}
      <div className="space-y-3">
        <h3 className="text-xl font-serif font-bold text-[#4a1d2e] flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-petal-600" />
          {config.rewardTitle}
        </h3>
        <p className="mx-auto max-w-md whitespace-pre-line text-left font-serif leading-relaxed text-[#4a1d2e]">
          {config.rewardDescription}
        </p>
      </div>

      {/* Input de archivo oculto con soporte de cámara directa en móvil */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!photo ? (
          /* 2. Fase de subida de foto con la excusa del plan */
          <motion.div
            key="upload-prompt"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-md rounded-2xl border border-petal-300/60 bg-[#fff8fa] p-5 shadow-sm space-y-4"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-petal-100 text-petal-700">
              <Camera className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <p className="font-serif font-semibold text-base text-[#4a1d2e]">
                ¿Ya tienes el paquete contigo?
              </p>
              <p className="font-serif italic text-xs sm:text-sm text-[#9f496e]">
                Sube una foto de tu nueva batería y funda para verificar el reto y desbloquear el plan de hoy.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              whileTap={{ scale: 0.97 }}
              disabled={compressing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-petal-600 via-petal-700 to-petal-800
                px-5 py-3 text-sm font-semibold text-white shadow-md transition active:scale-95 disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              {compressing ? "Procesando foto..." : "Hacer foto / Subir foto"}
            </motion.button>
          </motion.div>
        ) : (
          /* 3. Fase de revelación tras subir la foto (Polaroid + Pista de la caja de zapatos) */
          <motion.div
            key="revealed-secret"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
            className="space-y-5"
          >
            {/* Foto enmarcada estilo Polaroid */}
            <div className="mx-auto max-w-xs rotate-[-1deg] rounded-2xl bg-white p-3 shadow-lg border border-petal-200/80 transition-transform">
              <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-petal-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt="Tu sorpresa"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] font-serif italic text-[#9f496e]">
                <span>Sevilla · 2 de Octubre</span>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1 text-petal-700 hover:text-petal-900 active:scale-95"
                  title="Cambiar foto"
                >
                  <RefreshCw className="h-3 w-3" />
                  Cambiar
                </button>
              </div>
            </div>

            {/* Mensaje de la segunda pista */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mx-auto max-w-md rounded-2xl border-2 border-petal-400/50 bg-[#fff5f8] p-5 shadow-sm space-y-3 text-left"
            >
              <div className="flex items-center gap-2 text-[#be185d]">
                <Box className="h-5 w-5 shrink-0" />
                <p className="font-serif font-bold text-base text-[#4a1d2e]">
                  Un momento...
                </p>
              </div>

              <p className="font-serif text-base leading-relaxed text-[#4a1d2e]">
                Te falta todavía un accesorio importante para complementar bien los 2 que acabas de recibir:
              </p>

              <p className="rounded-xl border border-petal-300 bg-[#fce7f3]/60 p-3.5 font-serif font-semibold text-base text-[#831843]">
                ¡Busca en la caja de zapatos que tienes encima del armario!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Day1;
