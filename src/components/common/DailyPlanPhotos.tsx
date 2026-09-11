"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface DailyPlanPhotosProps {
  photos?: string[];
  layout?: "single" | "diagonal" | "grid";
  altPrefix?: string;
}

function PhotoItem({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`flex flex-col items-center justify-center border border-dashed border-[#f472b6]/40 bg-[#faf0f4] text-[#9d5272] p-2 text-center select-none ${className}`}>
        <ImageOff className="h-4 w-4 mb-1 text-[#be185d]/60" />
        <span className="text-[10px] font-serif italic leading-tight truncate max-w-full px-1 text-[#9f496e]">
          {src ? src.replace(/^.*\//, "") : "recuerdo fotográfico"}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${className}`}
    />
  );
}

export function DailyPlanPhotos({
  photos = [],
  layout = "single",
  altPrefix = "Plan foto",
}: DailyPlanPhotosProps) {
  if (!photos || photos.length === 0) {
    return null;
  }

  // Determinar layout automático si no está forzado o según cantidad
  const count = photos.length;
  const activeLayout = layout === "diagonal" || (layout !== "single" && count === 2)
    ? "diagonal"
    : count >= 3 || layout === "grid"
    ? "grid"
    : "single";

  return (
    <div className="mt-3 pt-2.5 border-t border-[#f4c2d4]/60">
      <span className="text-[10px] font-serif uppercase tracking-widest text-[#9d5272] block mb-2 font-semibold">
        Momentos / Fotos del día
      </span>

      {/* Caso: 2 FOTOS DIVIDIDAS EN DIAGONAL */}
      {activeLayout === "diagonal" && (
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#f472b6]/35 shadow-[inset_0_0_0_2px_#faf0f4,0_4px_12px_rgba(74,29,46,0.08)] bg-[#faf0f4]">
          {/* Foto 1: Mitad superior/izquierda diagonal */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          >
            <PhotoItem src={photos[0]} alt={`${altPrefix} 1`} />
          </div>

          {/* Foto 2: Mitad inferior/derecha diagonal */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          >
            <PhotoItem src={photos[1]} alt={`${altPrefix} 2`} />
          </div>

          {/* Línea divisoria diagonal con tinte lacre suave */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to top right, transparent calc(50% - 1.5px), #e895b2 50%, transparent calc(50% + 1.5px))",
            }}
          />
        </div>
      )}

      {/* Caso: 3 o 4 FOTOS EN CUADRÍCULA O MITADES */}
      {activeLayout === "grid" && (
        <div className="grid grid-cols-2 gap-1.5 h-44 w-full overflow-hidden rounded-xl border border-[#f472b6]/35 p-1 bg-[#faf0f4] shadow-[inset_0_0_0_2px_#faf0f4,0_4px_12px_rgba(74,29,46,0.08)]">
          {photos.slice(0, 4).map((p, idx) => (
            <div key={idx} className="relative h-full w-full overflow-hidden rounded-lg border border-[#f472b6]/20">
              <PhotoItem src={p} alt={`${altPrefix} ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* Caso: 1 FOTO COMPACTA */}
      {activeLayout === "single" && (
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#f472b6]/35 shadow-[inset_0_0_0_2px_#faf0f4,0_4px_12px_rgba(74,29,46,0.08)] bg-[#faf0f4]">
          <PhotoItem src={photos[0]} alt={`${altPrefix} 1`} />
        </div>
      )}
    </div>
  );
}

export default DailyPlanPhotos;
