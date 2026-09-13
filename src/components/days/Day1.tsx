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
 * Diseño sin scroll: La tarjeta transiciona limpiamente de un paso a otro:
 * - Paso 1: Muestra el premio de la batería + funda y el botón para subir la foto.
 * - Paso 2: Transiciona y reemplaza el contenido por la foto polaroid y la pista final
 *   de la caja de zapatos.
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
        // Redimensionar para optimizar peso y memoria
        const maxDim = 800;
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
    <div className="w-full text-center">
      {/* Input oculto para cámara o fototeca */}
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
          /* ========================================================= */
          /* PASO 1: PREMIO BATERÍA + FUNDA Y RETO DE SUBIR FOTO       */
          /* ========================================================= */
          <motion.div
            key="step-battery"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h3 className="text-xl font-serif font-bold text-[#4a1d2e] flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-petal-600 shrink-0" />
                {config.rewardTitle}
              </h3>
              <p className="font-serif text-sm leading-relaxed text-[#4a1d2e]">
                ¡Tu primera sorpresa es una <strong className="text-[#831843]">batería portátil con MagSafe</strong>!
              </p>
            </div>

            <div className="rounded-2xl border border-petal-300/60 bg-[#fff5f8] p-4 text-left space-y-2">
              <p className="font-serif text-xs sm:text-sm text-[#4a1d2e] leading-relaxed">
                Como tu funda actual no tiene agarre magnético, te incluye también una funda compatible para usarla desde hoy mismo.
              </p>
              <p className="font-serif font-semibold text-xs text-[#831843] bg-white/70 rounded-xl p-2.5 border border-petal-200">
                📍 Pista: Ve a buscar el paquete al bolsillo trasero de mi mochila negra.
              </p>
            </div>

            {/* Acción de verificación */}
            <div className="rounded-2xl border border-dashed border-petal-400/60 bg-[#fff8fa] p-4 space-y-3">
              <div className="space-y-0.5">
                <p className="font-serif font-semibold text-sm text-[#4a1d2e]">
                  ¿Ya la tienes contigo?
                </p>
                <p className="font-serif italic text-xs text-[#9f496e]">
                  Sube una foto de tu nueva batería y funda para desbloquear el plan de hoy.
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                whileTap={{ scale: 0.97 }}
                disabled={compressing}
                className="primary-action inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-petal-600 via-petal-700 to-petal-800
                  px-4 py-3 text-sm font-semibold text-white shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                {compressing ? "Procesando foto..." : "Hacer o subir foto"}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* PASO 2: TRANSICIÓN COMPLETA A POLAROID + CAJA DE ZAPATOS  */
          /* ========================================================= */
          <motion.div
            key="step-revelation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Foto Polaroid compacta para no requerir scroll */}
            <div className="mx-auto w-44 rotate-[-1deg] rounded-xl bg-white p-2.5 shadow-md border border-petal-200">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-petal-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt="Tu sorpresa"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between px-0.5 text-[10px] font-serif italic text-[#9f496e]">
                <span>Sevilla · 2 Oct</span>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-0.5 text-petal-700 hover:text-petal-900 active:scale-95"
                  title="Cambiar foto"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  Cambiar
                </button>
              </div>
            </div>

            {/* Mensaje de la segunda pista de la caja de zapatos */}
            <div className="rounded-2xl border-2 border-petal-400/50 bg-[#fff5f8] p-4 text-left space-y-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-[#be185d]">
                <Box className="h-4 w-4 shrink-0" />
                <p className="font-serif font-bold text-sm text-[#4a1d2e]">
                  Un momento...
                </p>
              </div>

              <p className="font-serif text-sm leading-relaxed text-[#4a1d2e]">
                Te falta todavía un accesorio importante para complementar bien los 2 que acabas de recibir:
              </p>

              <p className="rounded-xl border border-petal-300 bg-[#fce7f3]/70 p-3 font-serif font-semibold text-sm text-[#831843] text-center">
                ¡Busca en la caja de zapatos que tienes encima del armario!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Day1;
