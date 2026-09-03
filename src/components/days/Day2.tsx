"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Play, Pause } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";
import { InteractivePolaroid } from "@/components/effects/InteractivePolaroid";
import { hapticTap } from "@/lib/haptics";

// ==========================================
// ESTRUCTURA DE DATOS DE CAPÍTULOS
// ==========================================
interface Chapter {
  id: string;
  title: string;
  connectorText?: string;
  folder: string;
  imageCount: number;
  closingText?: string;
}

const chapters: Chapter[] = [
  {
    id: "inicios",
    title: "Los Inicios",
    connectorText:
      "Empezamos esta aventura casi sin darnos cuenta. No tengo muchas fotos de esos primeros días, pero sí muchos recuerdos y momentos que nos han hecho llegar hasta aquí.",
    folder: "/gallery/1_inicios",
    imageCount: 2,
  },
  {
    id: "postureos",
    title: "Postureos y Modelaje",
    connectorText:
      "Poco a poco fuimos ganando confianza y pronto descubrí que, para ti, cualquier espejo es la excusa perfecta para una foto o un recuerdo.",
    closingText:
      "muchos outfits y espejos , tantos que no me cabían todas las fotos...",
    folder: "/gallery/2_postureo",
    imageCount: 31,
  },
  {
    id: "viajes",
    title: "Conociendo mundo",
    connectorText:
      "Después de dominar todos los espejos que nos íbamos encontrando, empezamos a conocer mundo juntos y a vivir momentos únicos e inolvidables.",
    folder: "/gallery/3_viajes",
    imageCount: 37,
  },
  {
    id: "cara_b",
    title: "La Cara B",
    connectorText:
      "Aunque, no todo en nuestra vida es postureo... y que conste que no hago malas fotos, veo la vida de otra 'forma'.",
    folder: "/gallery/4_intimas",
    imageCount: 52,
  },
  {
    id: "duros",
    title: "Apretando los dientes",
    connectorText:
      "Pero más allá de los viajes y las risas, también nos ha tocado apretar los dientes. La vida a veces se hace un poco cuesta arriba, pero juntos hemos sabido sostenernos en los momentos más duros y difíciles.",
    folder: "/gallery/5_duros",
    imageCount: 8,
  },
  {
    id: "felicidad",
    title: "Superación y Cariño",
    connectorText:
      "Y precisamente por habernos sostenido en lo malo, ahora sabemos disfrutar, exprimir cada sonrisa y querernos en lo bueno.",
    closingText:
      "Juntos hemos podido superar siempre los malos momentos y así será siempre. Te amo ❤️",
    folder: "/gallery/6_felicidad",
    imageCount: 31,
  },
];

// ==========================================
// CONFIGURACIONES ESPECIALES DE FOTOS
// ==========================================
const PHOTO_CAPTIONS: Record<string, string> = {
  // 3_viajes: escapadas y momentos destacados
  "/gallery/3_viajes/3.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/4.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/5.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/6.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/7.jpg": "Nuestra primera escapada juntos...",

  "/gallery/3_viajes/15.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/16.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/17.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/18.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/19.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/20.jpg": "Valencia y nuestro segundo Voltereta...",

  "/gallery/3_viajes/32.jpg": "Primer eclipse juntos ❤️",
  "/gallery/3_viajes/33.jpg": "Primer eclipse juntos ❤️",

  "/gallery/3_viajes/34.jpg": "Nuestra primera vez en la playa juntos 🥰",
  "/gallery/3_viajes/35.jpg": "Nuestra primera vez en la playa juntos 🥰",
  "/gallery/3_viajes/36.jpg": "Nuestra primera vez en la playa juntos 🥰",
};

// Rotación para fotos verticales giradas (+90 grados)
const IMAGE_ROTATIONS: Record<string, number> = {
  "/gallery/3_viajes/8.jpg": 90,
  "/gallery/4_intimas/21.jpg": 90,
  "/gallery/4_intimas/22.jpg": 90,
  "/gallery/5_duros/7.jpg": 90,
};

// Orden de fotos específico por capítulo
const CHAPTER_IMAGE_LISTS: Record<string, number[]> = {
  inicios: [1, 2],
  postureos: Array.from({ length: 31 }, (_, i) => i + 1),
  viajes: Array.from({ length: 37 }, (_, i) => i + 1),
  cara_b: Array.from({ length: 52 }, (_, i) => i + 1),
  duros: [2, 3, 4, 5, 6, 7, 8, 1], // la foto 1.jpg es la última (emotiva y solitaria)
  felicidad: [
    2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 23, // 23.jpg es la última (Polaroid flippable)
  ],
};

function getChapterImageOrder(chapterId: string, imageCount: number): number[] {
  if (CHAPTER_IMAGE_LISTS[chapterId]) {
    return CHAPTER_IMAGE_LISTS[chapterId];
  }
  return Array.from({ length: imageCount }, (_, i) => i + 1);
}

// ==========================================
// MOTOR DE AGRUPACIÓN (BENTO GRID CHUNKER)
// ==========================================
function chunkChapterImages(chapterId: string, imageOrder: number[]): number[][] {
  const chunks: number[][] = [];
  const remaining = [...imageOrder];

  if (chapterId === "inicios") {
    // 2 imágenes -> 1 escena dividida
    return [remaining];
  }

  if (chapterId === "duros") {
    // 8 imágenes: [2, 3, 4, 5, 6, 7, 8, 1]
    // Dividimos en: 3 fotos, 4 fotos, y 1 foto final (la 1.jpg)
    return [
      remaining.slice(0, 3),
      remaining.slice(3, 7),
      remaining.slice(7, 8),
    ];
  }

  if (chapterId === "felicidad") {
    // La última foto (23.jpg) debe ser solitaria (Layout 1) para la Polaroid 3D interactiva
    const lastItem = remaining.pop()!;
    const pattern = [3, 4, 2, 4, 3, 2, 4, 4, 4];
    let pIdx = 0;
    while (remaining.length > 0) {
      let chunkSize = pattern[pIdx % pattern.length];
      if (remaining.length < chunkSize) {
        chunkSize = remaining.length;
      }
      chunks.push(remaining.splice(0, chunkSize));
      pIdx++;
    }
    chunks.push([lastItem]);
    return chunks;
  }

  // Capítulos generales (postureos, viajes, cara_b): ritmo dinámico asimétrico
  const pattern = [3, 4, 2, 4, 3, 2, 4, 3, 4];
  let pIdx = 0;
  while (remaining.length > 0) {
    let chunkSize = pattern[pIdx % pattern.length];
    if (remaining.length === 1 && chunks.length > 0) {
      const prev = chunks[chunks.length - 1];
      if (prev.length > 2) {
        const borrowed = prev.pop()!;
        chunks.push([borrowed, remaining.pop()!]);
        break;
      }
    }
    if (remaining.length < chunkSize) {
      chunkSize = remaining.length;
    }
    chunks.push(remaining.splice(0, chunkSize));
    pIdx++;
  }

  return chunks;
}

// ==========================================
// TIPOS DE ESCENA (MEMORIES EDITORIAL)
// ==========================================
export type Scene =
  | {
      type: "interstitial";
      id: string;
      chapterId: string;
      chapterIndex: number;
      chapterTitle: string;
      subtitle?: string;
      text: string;
      duration: number;
    }
  | {
      type: "mosaic";
      id: string;
      chapterId: string;
      chapterIndex: number;
      chapterTitle: string;
      images: string[];
      layout: 1 | 2 | 3 | 4;
      caption?: string;
      duration: number;
    }
  | {
      type: "end";
      id: string;
      text: string;
      duration: number;
    };

// Construye la lista completa de escenas de todos los capítulos
function buildEditorialScenes(): Scene[] {
  const sceneList: Scene[] = [];

  chapters.forEach((ch, chIdx) => {
    // Fase 1: Diapositiva Intersticial de Entrada (Respiro visual antes de las fotos)
    if (ch.connectorText) {
      const duration = Math.max(4800, ch.connectorText.length * 34 + 1800);
      sceneList.push({
        type: "interstitial",
        id: `intro-${ch.id}`,
        chapterId: ch.id,
        chapterIndex: chIdx,
        chapterTitle: ch.title,
        subtitle: `Capítulo ${chIdx + 1}`,
        text: ch.connectorText,
        duration,
      });
    }

    // Fase 2: Mosaicos Bento de Fotos
    const imageOrder = getChapterImageOrder(ch.id, ch.imageCount);
    const chunks = chunkChapterImages(ch.id, imageOrder);

    chunks.forEach((chunk, chunkIdx) => {
      const images = chunk.map((num) => `${ch.folder}/${num}.jpg`);
      const layout = chunk.length as 1 | 2 | 3 | 4;

      // Buscar subtítulo especial para el grupo si aplica
      const firstWithCaption = images.find((src) => PHOTO_CAPTIONS[src]);
      const caption = firstWithCaption ? PHOTO_CAPTIONS[firstWithCaption] : undefined;

      // Duraciones rítmicas según cantidad de fotos en pantalla
      let duration = 3200;
      if (layout === 2) duration = 3800;
      else if (layout === 3) duration = 4600;
      else if (layout === 4) duration = 5200;

      // Si es la Polaroid 23 de felicidad, darle más tiempo para interactuar
      if (images.includes("/gallery/6_felicidad/23.jpg")) {
        duration = 6500;
      }

      sceneList.push({
        type: "mosaic",
        id: `mosaic-${ch.id}-${chunkIdx}`,
        chapterId: ch.id,
        chapterIndex: chIdx,
        chapterTitle: ch.title,
        images,
        layout,
        caption,
        duration,
      });
    });

    // Diapositiva Intersticial de Cierre del Capítulo (si tiene)
    if (ch.closingText) {
      const duration = Math.max(4800, ch.closingText.length * 34 + 1800);
      sceneList.push({
        type: "interstitial",
        id: `closing-${ch.id}`,
        chapterId: ch.id,
        chapterIndex: chIdx,
        chapterTitle: ch.title,
        subtitle: "Reflexión",
        text: ch.closingText,
        duration,
      });
    }
  });

  // Escena final con premio
  sceneList.push({
    type: "end",
    id: "final-congratulations",
    text: "Además has ganado una pequeña sorpresa... (tienes tu premio físico esperándote)",
    duration: 8000,
  });

  return sceneList;
}

// ==========================================
// COMPONENTE: TEXTO TIPO MÁQUINA DE ESCRIBIR
// ==========================================
function SubtleTypewriterText({
  text,
  isPaused,
}: {
  text: string;
  isPaused?: boolean;
}) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(0);
    let count = 0;
    const interval = setInterval(() => {
      if (isPaused) return;
      count += 1;
      setCharCount(count);
      if (count >= text.length) {
        clearInterval(interval);
      }
    }, 32);
    return () => clearInterval(interval);
  }, [text, isPaused]);

  return (
    <p className="font-serif text-2xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-loose text-white/95 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
      {text.slice(0, charCount)}
      {charCount < text.length && (
        <span className="ml-1.5 inline-block h-[0.9em] w-[2px] animate-pulse bg-pink-400 align-middle shadow-[0_0_12px_rgba(244,114,182,0.9)]" />
      )}
    </p>
  );
}

// ==========================================
// COMPONENTE: RENDERIZADOR BENTO GRID
// ==========================================
function BentoGridRenderer({
  images,
  layout,
  caption,
}: {
  images: string[];
  layout: 1 | 2 | 3 | 4;
  caption?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-h-[74vh] max-w-md mx-auto p-2">
      {/* Subtítulo flotante editorial si existe para este momento */}
      {caption && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2.5 text-center shrink-0"
        >
          <span className="inline-block px-3.5 py-1 rounded-full bg-black/60 border border-white/20 text-xs sm:text-sm font-serif italic text-pink-200 backdrop-blur-md shadow-lg">
            {caption}
          </span>
        </motion.div>
      )}

      {/* ================= LAYOUT 1 FOTO ================= */}
      {layout === 1 && (
        images[0] === "/gallery/6_felicidad/23.jpg" ? (
          <InteractivePolaroid
            imageSrc={images[0]}
            secretNote="Busca detrás de la funda de mi móvil"
          />
        ) : (
          <div className="w-full h-full max-h-[66vh] p-2 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt="Recuerdo"
              style={
                IMAGE_ROTATIONS[images[0]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[0]]}deg)` }
                  : undefined
              }
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )
      )}

      {/* ================= LAYOUT 2 FOTOS ================= */}
      {layout === 2 && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full h-full max-h-[66vh]">
          {images.map((img, i) => (
            <div
              key={i}
              className="p-1.5 sm:p-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Recuerdo ${i + 1}`}
                style={
                  IMAGE_ROTATIONS[img]
                    ? { transform: `rotate(${IMAGE_ROTATIONS[img]}deg)` }
                    : undefined
                }
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ================= LAYOUT 3 FOTOS (ASIMÉTRICO BENTO) ================= */}
      {layout === 3 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 w-full h-full max-h-[66vh]">
          {/* Foto 1: Columna vertical alta a la izquierda (ocupa 2 filas) */}
          <div className="row-span-2 col-span-1 p-1.5 sm:p-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt="Recuerdo principal"
              style={
                IMAGE_ROTATIONS[images[0]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[0]]}deg)` }
                  : undefined
              }
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Foto 2: Arriba a la derecha */}
          <div className="row-span-1 col-span-1 p-1.5 sm:p-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[1]}
              alt="Recuerdo 2"
              style={
                IMAGE_ROTATIONS[images[1]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[1]]}deg)` }
                  : undefined
              }
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Foto 3: Abajo a la derecha */}
          <div className="row-span-1 col-span-1 p-1.5 sm:p-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[2]}
              alt="Recuerdo 3"
              style={
                IMAGE_ROTATIONS[images[2]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[2]]}deg)` }
                  : undefined
              }
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* ================= LAYOUT 4 FOTOS (GRID 2x2) ================= */}
      {layout === 4 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 w-full h-full max-h-[66vh]">
          {images.map((img, i) => (
            <div
              key={i}
              className="p-1.5 sm:p-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Recuerdo ${i + 1}`}
                style={
                  IMAGE_ROTATIONS[img]
                    ? { transform: `rotate(${IMAGE_ROTATIONS[img]}deg)` }
                    : undefined
                }
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// REPRODUCTOR EDITORIAL SLIDESHOW AUTOMÁTICO
// ==========================================
const transitionVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.96,
    x: direction > 0 ? 50 : -50,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 1.02,
    x: direction > 0 ? -50 : 50,
  }),
};

function SlideshowPlayer({ onFinish }: { onFinish: () => void }) {
  const scenes = useMemo(() => buildEditorialScenes(), []);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const activeScene = scenes[index];
  const nextScene = index + 1 < scenes.length ? scenes[index + 1] : null;

  // Calcular las escenas del capítulo activo para la barra segmentada
  const currentChapterScenes = useMemo(() => {
    if (!activeScene || activeScene.type === "end") return [];
    return scenes.filter(
      (s) => s.type !== "end" && s.chapterId === activeScene.chapterId,
    );
  }, [scenes, activeScene]);

  const sceneIndexInChapter = useMemo(() => {
    if (!activeScene || activeScene.type === "end") return 0;
    return currentChapterScenes.findIndex((s) => s.id === activeScene.id);
  }, [currentChapterScenes, activeScene]);

  // Barra de progreso de la escena activa
  const [progressPercent, setProgressPercent] = useState(0);

  const goToPrev = useCallback(() => {
    if (index > 0) {
      hapticTap();
      setDirection(-1);
      setProgressPercent(0);
      setIndex((prev) => prev - 1);
    }
  }, [index]);

  const goToNext = useCallback(() => {
    if (index < scenes.length - 1) {
      hapticTap();
      setDirection(1);
      setProgressPercent(0);
      setIndex((prev) => prev + 1);
    } else {
      onFinish();
    }
  }, [index, scenes.length, onFinish]);

  // Timer de Autoplay
  useEffect(() => {
    if (isPaused) return;

    let lastTime = performance.now();
    let elapsed = 0;
    let rafId: number;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      elapsed += delta * speed;
      const targetDuration = activeScene.duration;
      const pct = Math.min(100, (elapsed / targetDuration) * 100);
      setProgressPercent(pct);

      if (elapsed >= targetDuration) {
        goToNext();
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [index, activeScene.duration, isPaused, speed, goToNext]);

  // Gestos táctiles estilo Instagram Stories (Mantener pulsado para pausar, toque en extremos para avanzar/retroceder)
  const pointerStartTime = useRef(0);
  const pointerStartX = useRef(0);
  const isHolding = useRef(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartTime.current = Date.now();
    pointerStartX.current = e.clientX;
    isHolding.current = false;

    // A los 220ms de mantener pulsado, se pausa
    holdTimer.current = setTimeout(() => {
      isHolding.current = true;
      setIsPaused(true);
    }, 220);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (holdTimer.current) clearTimeout(holdTimer.current);

    const elapsed = Date.now() - pointerStartTime.current;
    const moveDist = Math.abs(e.clientX - pointerStartX.current);

    if (isHolding.current) {
      // Estaba manteniendo presionado: al levantar el dedo reanuda
      isHolding.current = false;
      setIsPaused(false);
      return;
    }

    // Fue un toque corto (tap)
    if (elapsed < 300 && moveDist < 18) {
      const screenWidth = window.innerWidth;
      // 30% izquierdo -> retroceder, 70% derecho -> avanzar
      if (e.clientX < screenWidth * 0.35) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  const handlePointerCancel = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (isHolding.current) {
      isHolding.current = false;
      setIsPaused(false);
    }
  };

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticTap();
    setIsPaused((prev) => !prev);
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticTap();
    setSpeed((prev) => {
      if (prev === 1.0) return 1.5;
      if (prev === 1.5) return 2.0;
      if (prev === 2.0) return 0.6;
      return 1.0;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black select-none overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* ================= BARRA SUPERIOR ESTILO STORIES ================= */}
      <div className="relative z-50 w-full px-4 pt-3 pb-2 space-y-2 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
        {/* Segmentos de progreso del capítulo */}
        <div className="flex items-center gap-1.5 w-full">
          {currentChapterScenes.map((sc, scIdx) => {
            let widthPct = 0;
            if (scIdx < sceneIndexInChapter) {
              widthPct = 100;
            } else if (scIdx === sceneIndexInChapter) {
              widthPct = progressPercent;
            }
            return (
              <div
                key={sc.id}
                className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden backdrop-blur-sm"
              >
                <div
                  className="h-full bg-pink-400 transition-none"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Cabecera con título del capítulo y botón saltar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-pink-300/80 font-medium">
              {activeScene.type !== "end"
                ? `Capítulo ${activeScene.chapterIndex + 1} de 6`
                : "Recuerdos"}
            </span>
            <span className="text-sm font-semibold text-white truncate max-w-[200px]">
              {activeScene.type !== "end" ? activeScene.chapterTitle : "Nuestra Historia"}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {isPaused && (
              <span className="rounded-full border border-pink-500/40 bg-pink-500/20 px-2.5 py-0.5 text-[11px] font-medium text-pink-300 animate-pulse">
                Pausado
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFinish();
              }}
              className="rounded-full bg-black/60 border border-white/20 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/80 active:scale-95 shadow-md"
            >
              Saltar
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENIDO DE LA ESCENA (VIRTUALIZADO CON DOUBLE BUFFERING) ================= */}
      <div className="relative flex-1 w-full flex items-center justify-center p-3 sm:p-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeScene.id}
            custom={direction}
            variants={transitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex h-full w-full items-center justify-center"
          >
            {/* FASE 1: DIAPOSITIVA INTERSTICIAL DE TEXTO (Respiro visual centrado) */}
            {activeScene.type === "interstitial" && (
              <div className="flex flex-col items-center justify-center text-center px-6 py-8 max-w-xl mx-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#1b0a2a]/90 to-[#0d0317]/95 p-8 shadow-2xl backdrop-blur-xl">
                {activeScene.subtitle && (
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300/85 mb-3 px-3 py-1 rounded-full border border-pink-400/20 bg-pink-500/10">
                    {activeScene.subtitle}
                  </span>
                )}
                <SubtleTypewriterText text={activeScene.text} isPaused={isPaused} />
              </div>
            )}

            {/* FASE 2: MOTOR DE MOSAICOS BENTO (1, 2, 3 o 4 fotos con marco editorial blanco) */}
            {activeScene.type === "mosaic" && (
              <BentoGridRenderer
                images={activeScene.images}
                layout={activeScene.layout}
                caption={activeScene.caption}
              />
            )}

            {/* ESCENA FINAL */}
            {activeScene.type === "end" && (
              <div className="flex flex-col items-center justify-center text-center px-6 py-8 max-w-md mx-auto rounded-3xl border border-pink-400/30 bg-gradient-to-b from-[#2a0e36] to-[#0c0312] p-8 shadow-2xl">
                <SubtleTypewriterText text={activeScene.text} isPaused={isPaused} />
                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFinish();
                  }}
                  className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-7 py-3 font-semibold text-white shadow-xl transition hover:brightness-110 active:scale-95"
                >
                  Ir a la Galería
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* DOUBLE BUFFERING: Pre-carga en memoria invisible de las imágenes de la siguiente escena */}
        {nextScene && nextScene.type === "mosaic" && (
          <div className="hidden" aria-hidden="true">
            {nextScene.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img}
                src={img}
                alt="preload"
                loading="eager"
                decoding="async"
              />
            ))}
          </div>
        )}
      </div>

      {/* Flechas de ayuda visual cuando está pausado */}
      {isPaused && (
        <div className="pointer-events-none fixed inset-y-0 inset-x-2 sm:inset-x-4 z-50 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            disabled={index === 0}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/80 border border-white/25 text-white backdrop-blur-md transition hover:scale-110 disabled:opacity-20 active:scale-95 shadow-2xl"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            disabled={index === scenes.length - 1}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/80 border border-white/25 text-white backdrop-blur-md transition hover:scale-110 disabled:opacity-20 active:scale-95 shadow-2xl"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}

      {/* ================= CONTROLES INFERIORES ================= */}
      <div className="relative z-50 w-full px-6 pb-6 pt-2 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Botón Pausar / Reanudar */}
          <button
            onClick={togglePause}
            className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95 ${
              isPaused
                ? "bg-pink-500 text-white ring-4 ring-pink-500/30"
                : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
            }`}
            title={isPaused ? "Reanudar" : "Pausar"}
          >
            {isPaused ? (
              <Play className="h-5 w-5 fill-white ml-0.5" />
            ) : (
              <Pause className="h-5 w-5 fill-white" />
            )}
          </button>

          {/* Botón Selector de Velocidad */}
          <button
            onClick={cycleSpeed}
            className="flex h-9 px-3.5 items-center justify-center rounded-full bg-white/10 border border-white/20 text-xs font-mono font-medium text-pink-300 backdrop-blur-md active:scale-95 shadow-md"
            title="Cambiar velocidad"
          >
            {speed}x
          </button>
        </div>

        <p className="text-[11px] text-white/50 tracking-wide">
          {isPaused ? "Pulsa flechas para moverte" : "Mantén para pausar · Toca lados"}
        </p>

        <span className="font-mono text-xs text-white/60">
          {index + 1}/{scenes.length}
        </span>
      </div>
    </motion.div>
  );
}

// ==========================================
// CARRUSEL MANUAL DE CAPÍTULO (FASE 3)
// ==========================================
function ChapterCarousel({
  chapter,
  onClose,
}: {
  chapter: Chapter;
  onClose: () => void;
}) {
  const scenes = useMemo(() => {
    const list: Scene[] = [];
    const chIdx = chapters.findIndex((c) => c.id === chapter.id);

    if (chapter.connectorText) {
      list.push({
        type: "interstitial",
        id: `c-intro-${chapter.id}`,
        chapterId: chapter.id,
        chapterIndex: chIdx,
        chapterTitle: chapter.title,
        subtitle: `Capítulo ${chIdx + 1}`,
        text: chapter.connectorText,
        duration: 4000,
      });
    }

    const imageOrder = getChapterImageOrder(chapter.id, chapter.imageCount);
    const chunks = chunkChapterImages(chapter.id, imageOrder);

    chunks.forEach((chunk, chunkIdx) => {
      const images = chunk.map((num) => `${chapter.folder}/${num}.jpg`);
      const layout = chunk.length as 1 | 2 | 3 | 4;
      const firstWithCaption = images.find((src) => PHOTO_CAPTIONS[src]);
      const caption = firstWithCaption ? PHOTO_CAPTIONS[firstWithCaption] : undefined;

      list.push({
        type: "mosaic",
        id: `c-mosaic-${chapter.id}-${chunkIdx}`,
        chapterId: chapter.id,
        chapterIndex: chIdx,
        chapterTitle: chapter.title,
        images,
        layout,
        caption,
        duration: 4000,
      });
    });

    if (chapter.closingText) {
      list.push({
        type: "interstitial",
        id: `c-closing-${chapter.id}`,
        chapterId: chapter.id,
        chapterIndex: chIdx,
        chapterTitle: chapter.title,
        subtitle: "Reflexión",
        text: chapter.closingText,
        duration: 4000,
      });
    }

    return list;
  }, [chapter]);

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    const next = page + newDirection;
    if (next >= 0 && next < scenes.length) {
      hapticTap();
      setDirection(newDirection);
      setPage(next);
    }
  };

  const activeScene = scenes[page];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-50 rounded-full bg-black/60 border border-white/20 p-2.5 text-white backdrop-blur-md transition hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Contenedor central */}
      <div className="relative flex h-full w-full max-w-4xl items-center justify-center overflow-hidden px-4 sm:px-12 py-16">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={transitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex h-full w-full items-center justify-center"
          >
            {activeScene.type === "interstitial" ? (
              <div className="flex flex-col items-center justify-center text-center px-6 py-8 max-w-lg mx-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#1b0a2a]/90 to-[#0d0317]/95 p-8 shadow-2xl backdrop-blur-xl">
                {activeScene.subtitle && (
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300/85 mb-3 px-3 py-1 rounded-full border border-pink-400/20 bg-pink-500/10">
                    {activeScene.subtitle}
                  </span>
                )}
                <p className="font-serif text-xl sm:text-2xl leading-relaxed text-white/95">
                  “{activeScene.text}”
                </p>
              </div>
            ) : activeScene.type === "mosaic" ? (
              <BentoGridRenderer
                images={activeScene.images}
                layout={activeScene.layout}
                caption={activeScene.caption}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles inferiores de paginación */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="pointer-events-auto rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-20 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="font-mono text-sm text-white/70">
          {page + 1} / {scenes.length}
        </span>
        <button
          onClick={() => paginate(1)}
          disabled={page === scenes.length - 1}
          className="pointer-events-auto rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-20 active:scale-95"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL (DAY 2)
// ==========================================
type Phase = "intro" | "slideshow" | "gallery";

export function Day2({ config, isUnlocked }: DayComponentProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  if (!isUnlocked) return null;

  return (
    <div className="space-y-6">
      {/* Fase 1: Intro (Mensaje de Éxito) */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-6 rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md"
        >
          <h3 className="text-2xl font-semibold text-white">{config.rewardTitle}</h3>
          {config.rewardDescription && (
            <p className="text-sm leading-relaxed text-white/80 md:text-base">
              {config.rewardDescription}
            </p>
          )}
          <button
            onClick={() => setPhase("slideshow")}
            className="flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-pink-600 active:scale-95 shadow-lg"
          >
            <Play className="h-5 w-5 fill-white" />
            Ver nuestra historia
          </button>
        </motion.div>
      )}

      {/* Fase 2: Slideshow Bento Editorial */}
      <AnimatePresence>
        {phase === "slideshow" && (
          <SlideshowPlayer onFinish={() => setPhase("gallery")} />
        )}
      </AnimatePresence>

      {/* Fase 3: Grid de Capítulos */}
      {phase === "gallery" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">Nuestra Historia</h3>
            <p className="text-sm text-white/70">Tómate tu tiempo para revivirla por capítulos.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {chapters.map((chapter, i) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveChapter(chapter)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl active:scale-95"
              >
                <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-20">
                  <ImageIcon className="h-24 w-24 text-white" />
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-pink-300">
                    Capítulo {i + 1}
                  </span>
                  <h4 className="text-lg font-medium text-white">{chapter.title}</h4>
                  <p className="mt-2 text-xs text-white/50">
                    {chapter.imageCount} recuerdos
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Visor de Carrusel Manual Bento */}
      <AnimatePresence>
        {activeChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <ChapterCarousel
              chapter={activeChapter}
              onClose={() => setActiveChapter(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Day2;
