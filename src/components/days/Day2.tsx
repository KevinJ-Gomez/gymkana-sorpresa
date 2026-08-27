"use client";

import { useRef, useEffect, useState, PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import type { DayComponentProps } from "@/types/gymkana";

const PHOTOS = [
  { src: "/gallery/1.jpg", caption: "Nuestro primer brindis.", rotate: -3 },
  { src: "/gallery/2.jpg", caption: "Las risas que no faltaban.", rotate: 2 },
  { src: "/gallery/3.jpg", caption: "Aquel rincón escondido.", rotate: -4 },
  { src: "/gallery/4.jpg", caption: "Caminando sin rumbo.", rotate: 5 },
  { src: "/gallery/5.jpg", caption: "El postre compartido.", rotate: -2 },
  { 
    src: "/gallery/6.jpg", 
    caption: "Y esta... esta es especial. Tanto que ha saltado de la pantalla. Tienes tu premio final (esta foto en formato Polaroid real) esperándote en casa.", 
    rotate: 3 
  },
];

export function Day2({ config, isUnlocked }: DayComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const scratchCount = useRef(0);

  useEffect(() => {
    if (!isUnlocked || !containerRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    // Canvas dimensions should match the visible container exactly
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Paint the "fog"
      ctx.fillStyle = "rgba(160, 165, 175, 0.98)"; 
      ctx.fillRect(0, 0, width, height);
      
      // Text hint
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Limpia el cristal...", width / 2, height / 2);
    }
  }, [isUnlocked]);

  const scratch = (e: ReactPointerEvent) => {
    if (cleared) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
    
    scratchCount.current += 1;
    if (scratchCount.current > 80 && !cleared) {
      setCleared(true);
    }
  };

  const handlePointerDown = (e: ReactPointerEvent) => {
    setIsDrawing(true);
    scratch(e);
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!isDrawing) return;
    scratch(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  if (!isUnlocked) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
      {config.rewardDescription && (
        <p className="text-sm text-white/75">{config.rewardDescription}</p>
      )}

      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-white/20 bg-black/40 h-[65vh] max-h-[600px]"
      >
        {/* Scrollable Gallery Content */}
        <div className={`h-full w-full p-6 pb-12 overflow-y-auto custom-scrollbar flex flex-col gap-10 ${!cleared ? "overflow-hidden" : ""}`}>
          {PHOTOS.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: photo.rotate }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex flex-col bg-[#fafafa] p-3 pt-4 shadow-2xl rounded-sm mx-auto max-w-[280px] w-full origin-center"
            >
              <div className="aspect-[4/3] w-full bg-gray-300 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-black/30 font-bold text-lg">
                  Foto {index + 1}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photo.src} 
                  alt={`Recuerdo ${index + 1}`} 
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <p className="text-black text-center mt-4 mb-2 font-serif text-sm leading-relaxed whitespace-pre-wrap px-2">
                {photo.caption}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Scratch Canvas Overlay */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`absolute top-0 left-0 w-full h-full z-20 cursor-crosshair touch-none transition-opacity duration-1000 ${cleared ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        />
      </div>
    </div>
  );
}

export default Day2;
