"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, FastForward, Play, Pause } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";
import { InteractivePolaroid } from "@/components/effects/InteractivePolaroid";
import { PostureoMosaic } from "./PostureoMosaic";
import { hapticTap } from "@/lib/haptics";

// ==========================================
// ESTRUCTURA DE DATOS
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
    folder: "/gallery/2_postureo",
    imageCount: 31,
  },
  {
    id: "viajes",
    title: "Conociendo mundo",
    connectorText:
      "Después de dominar todos los espejos que nos íbamos encontrando, empezamos a conocer mundo juntos y a vivir momentos único e inolvidables.",
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

// Textos flotantes en la parte alta de fotos específicas
const PHOTO_CAPTIONS: Record<string, string> = {
  // 3_viajes: fotos 3 a 7
  "/gallery/3_viajes/3.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/4.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/5.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/6.jpg": "Nuestra primera escapada juntos...",
  "/gallery/3_viajes/7.jpg": "Nuestra primera escapada juntos...",

  // 3_viajes: fotos 15 a 20
  "/gallery/3_viajes/15.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/16.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/17.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/18.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/19.jpg": "Valencia y nuestro segundo Voltereta...",
  "/gallery/3_viajes/20.jpg": "Valencia y nuestro segundo Voltereta...",

  // 3_viajes: fotos 32 y 33
  "/gallery/3_viajes/32.jpg": "Primer eclipse juntos ❤️",
  "/gallery/3_viajes/33.jpg": "Primer eclipse juntos ❤️",

  // 3_viajes: fotos 34, 35 y 36
  "/gallery/3_viajes/34.jpg": "Nuestra primera vez en la playa juntos 🥰",
  "/gallery/3_viajes/35.jpg": "Nuestra primera vez en la playa juntos 🥰",
  "/gallery/3_viajes/36.jpg": "Nuestra primera vez en la playa juntos 🥰",
};

// Rotación para corregir fotos con la cabeza hacia la izquierda (+90 grados)
const IMAGE_ROTATIONS: Record<string, number> = {
  "/gallery/3_viajes/8.jpg": 90,
  "/gallery/4_intimas/21.jpg": 90,
  "/gallery/4_intimas/22.jpg": 90,
  "/gallery/5_duros/7.jpg": 90,
};

// Listas explícitas de imágenes existentes en disco por capítulo
const CHAPTER_IMAGE_LISTS: Record<string, number[]> = {
  inicios: [1, 2],
  postureos: Array.from({ length: 31 }, (_, i) => i + 1),
  viajes: Array.from({ length: 37 }, (_, i) => i + 1),
  cara_b: Array.from({ length: 52 }, (_, i) => i + 1),
  duros: [2, 3, 4, 5, 6, 7, 8, 1], // en 5_duros la imagen 1.jpg debe mostrarse la última y empezar por la número 2
  felicidad: [
    2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 23, // la última foto debe ser la número 23
  ],
};

// Helper para obtener el orden personalizado de imágenes de cada capítulo
function getChapterImageOrder(chapterId: string, imageCount: number): number[] {
  if (CHAPTER_IMAGE_LISTS[chapterId]) {
    return CHAPTER_IMAGE_LISTS[chapterId];
  }
  return Array.from({ length: imageCount }, (_, i) => i + 1);
}

// ==========================================
// COMPONENTE TEXTO TIPO MÁQUINA DE ESCRIBIR
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
    }, 38); // 38ms por caracter: cadencia suave, fluida y sin saltos
    return () => clearInterval(interval);
  }, [text, isPaused]);

  return (
    <div className="max-w-2xl px-6 py-8 text-center select-none">
      <p className="font-serif text-2xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-loose text-white/95 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
        {text.slice(0, charCount)}
        {charCount < text.length && (
          <span className="ml-1.5 inline-block h-[0.9em] w-[2px] animate-pulse bg-pink-400 align-middle shadow-[0_0_10px_rgba(244,114,182,0.9)]" />
        )}
      </p>
    </div>
  );
}

// ==========================================
// FASE 2: REPRODUCTOR SLIDESHOW AUTOMÁTICO
// ==========================================
type Slide =
  | { type: "intro"; content: string; duration: number }
  | { type: "image"; src: string; duration: number; caption?: string }
  | { type: "mosaic"; images: string[]; text: string; duration: number }
  | { type: "closing"; content: string; duration: number }
  | { type: "end"; content: string; duration: number };

const slideshowVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.95,
    x: direction > 0 ? 80 : direction < 0 ? -80 : 0,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 1.02,
    x: direction > 0 ? -80 : direction < 0 ? 80 : 0,
  }),
};

function SlideshowPlayer({ onFinish }: { onFinish: () => void }) {
  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [];
    chapters.forEach((ch) => {
      // Tarjeta de texto inicial del capítulo
      if (ch.connectorText) {
        const textDuration = Math.max(6000, ch.connectorText.length * 40 + 2800);
        list.push({ type: "intro", content: ch.connectorText, duration: textDuration });
      }

      // En el capítulo Postureo: en vez de 31 slides pesadas, se muestra el mosaico dinámico
      if (ch.id === "postureos") {
        const imageOrder = getChapterImageOrder(ch.id, ch.imageCount);
        const images = imageOrder.map((imgNum) => `${ch.folder}/${imgNum}.jpg`);
        list.push({
          type: "mosaic",
          images,
          text: "muchos outfits y espejos , tantos que no me cabían todas las fotos...",
          duration: 21500,
        });
      } else {
        const imgDuration = ch.imageCount > 15 ? 1050 : 2200;
        const imageOrder = getChapterImageOrder(ch.id, ch.imageCount);
        imageOrder.forEach((imgNum) => {
          const src = `${ch.folder}/${imgNum}.jpg`;
          const duration = ch.id === "felicidad" && imgNum === 23 ? 4200 : imgDuration;
          list.push({
            type: "image",
            src,
            duration,
            caption: PHOTO_CAPTIONS[src],
          });
        });
      }

      if (ch.closingText) {
        const closeDuration = Math.max(6000, ch.closingText.length * 40 + 2800);
        list.push({ type: "closing", content: ch.closingText, duration: closeDuration });
      }
    });

    list.push({
      type: "end",
      content: "Además has ganado una pequeña sorpresa... (tienes tu premio físico esperándote)",
      duration: 7500,
    });
    return list;
  }, []);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[index];

  // Controlador de velocidad con Joystick
  const joystickX = useMotionValue(0);
  // Mapeamos: -70px -> cámara lenta (0.2x), 0 -> normal (1x), 70px -> muy rápido (6x)
  const speedMultiplier = useTransform(joystickX, [-70, 0, 70], [0.2, 1, 6]);
  const [speedLabel, setSpeedLabel] = useState("1.0x");

  useEffect(() => {
    return speedMultiplier.on("change", (v) => {
      if (Math.abs(v - 1) < 0.08) {
        setSpeedLabel("1.0x");
      } else {
        setSpeedLabel(`${v.toFixed(1)}x`);
      }
    });
  }, [speedMultiplier]);

  // Progreso visual (barra superior)
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    let lastTime = performance.now();
    let progress = 0;
    let rafId: number;

    const tick = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      progress += delta * speedMultiplier.get();
      setProgressPercent((progress / activeSlide.duration) * 100);

      if (progress >= activeSlide.duration) {
        if (index < slides.length - 1) {
          setDirection(1);
          setIndex((prev) => prev + 1);
        } else {
          onFinish();
        }
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [index, activeSlide.duration, slides.length, onFinish, speedMultiplier, isPaused]);

  const handleDragEnd = () => {
    // Al soltar el joystick, vuelve magnéticamente al centro
    animate(joystickX, 0, { type: "spring", stiffness: 350, damping: 25 });
  };

  const goToPrev = () => {
    if (index > 0) {
      setDirection(-1);
      setProgressPercent(0);
      setIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (index < slides.length - 1) {
      setDirection(1);
      setProgressPercent(0);
      setIndex((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none"
    >
      {/* Barra de progreso de la diapositiva actual */}
      <div className="absolute left-0 top-0 h-1 w-full bg-white/10 z-50">
        <motion.div
          className={`h-full ${isPaused ? "bg-pink-300/60" : "bg-pink-400"}`}
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          transition={{ duration: 0 }}
        />
      </div>

      {/* Barra superior con botón Saltar y Estado */}
      <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 pt-5 pb-3 pointer-events-none">
        {isPaused ? (
          <span className="pointer-events-auto rounded-full border border-pink-500/30 bg-pink-500/20 px-3.5 py-1 text-xs font-medium text-pink-300 backdrop-blur-md animate-pulse">
            Pausado
          </span>
        ) : (
          <div />
        )}
        <button
          onClick={onFinish}
          className="pointer-events-auto rounded-full bg-black/60 border border-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg"
        >
          Saltar
        </button>
      </div>

      {/* Flechas de navegación rápida en modo pausado */}
      {isPaused && (
        <>
          <button
            onClick={goToPrev}
            disabled={index === 0}
            className="absolute left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-md transition hover:bg-black/80 hover:scale-110 disabled:opacity-20 active:scale-95"
            title="Foto anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            disabled={index === slides.length - 1}
            className="absolute right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-md transition hover:bg-black/80 hover:scale-110 disabled:opacity-20 active:scale-95"
            title="Foto siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Texto superior flotante, grande, sin recuadro y continuo (con suficiente margen bajo la barra superior) */}
      <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none px-6 text-center max-w-xl w-full">
        <AnimatePresence mode="wait">
          {activeSlide.type === "image" && activeSlide.caption && (
            <motion.p
              key={activeSlide.caption}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="font-serif text-lg sm:text-2xl md:text-3xl font-medium tracking-wide text-pink-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] select-none leading-snug"
            >
              {activeSlide.caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Content (Swipeable en modo pausado) */}
      <div className="relative flex h-full w-full items-center justify-center p-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideshowVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            drag={isPaused ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, { offset, velocity }) => {
              if (!isPaused) return;
              if (offset.x > 50 || velocity.x > 300) {
                goToPrev();
              } else if (offset.x < -50 || velocity.x < -300) {
                goToNext();
              }
            }}
            className="flex h-full w-full items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {activeSlide.type === "mosaic" ? (
              <PostureoMosaic
                images={activeSlide.images}
                text={activeSlide.text}
                isPaused={isPaused}
              />
            ) : activeSlide.type === "image" ? (
              activeSlide.src === "/gallery/6_felicidad/23.jpg" ? (
                <InteractivePolaroid
                  imageSrc={activeSlide.src}
                  secretNote="Busca detrás de la funda de mi móvil"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeSlide.src}
                    alt="Slideshow image"
                    style={
                      IMAGE_ROTATIONS[activeSlide.src]
                        ? {
                            transform: `rotate(${IMAGE_ROTATIONS[activeSlide.src]}deg)`,
                            maxHeight: "75vw",
                            maxWidth: "75vh",
                          }
                        : undefined
                    }
                    className="max-h-full max-w-full rounded-md object-contain shadow-2xl pointer-events-none"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <SubtleTypewriterText
                  text={activeSlide.content}
                  isPaused={isPaused}
                />
                {activeSlide.type === "end" && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={onFinish}
                    className="mt-6 rounded-full bg-pink-500 px-7 py-3 font-medium text-white shadow-2xl backdrop-blur-md transition hover:bg-pink-600 hover:scale-105 active:scale-95"
                  >
                    Ir a la Galería
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles Inferiores: Pausa/Play + Joystick de Velocidad + Contador */}
      <div className="absolute bottom-6 flex flex-col items-center gap-2.5 z-40">
        {/* Indicador de gesto en pausa */}
        {isPaused && (
          <p className="text-xs text-pink-200/90 tracking-wide font-light animate-pulse drop-shadow">
            Arrastra ‹ › para moverte entre recuerdos
          </p>
        )}

        <div className="flex items-center gap-4">
          {/* Botón Pausa / Reanudar */}
          <button
            onClick={togglePause}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95 ${
              isPaused
                ? "bg-pink-500 text-white ring-4 ring-pink-500/30 hover:bg-pink-600"
                : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
            }`}
            title={isPaused ? "Reanudar película" : "Pausar película"}
          >
            {isPaused ? <Play className="h-5 w-5 fill-white ml-0.5" /> : <Pause className="h-5 w-5 fill-white" />}
          </button>

          {/* Joystick Controlador de Velocidad */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex w-52 sm:w-60 items-center justify-between px-2 text-[10px] text-white/60">
              <span>🐢 Lento</span>
              <span className="font-mono text-pink-300 font-medium">
                {speedLabel} ({index + 1}/{slides.length})
              </span>
              <span>Rápido 🐇</span>
            </div>
            <div className="relative flex h-11 w-52 sm:w-60 items-center rounded-full bg-white/10 backdrop-blur-md shadow-inner border border-white/10 touch-none">
              <div className="absolute left-1/2 h-3.5 w-1 -translate-x-1/2 rounded bg-white/25" />
              <motion.div
                drag="x"
                dragConstraints={{ left: -70, right: 70 }}
                dragElastic={0}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{ x: joystickX }}
                className="absolute left-1/2 ml-[calc(-1.5rem/2)] flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-white shadow-lg active:cursor-grabbing touch-none select-none"
              >
                <div className="h-3 w-3 rounded-full bg-pink-500 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// FASE 3: CARRUSEL MANUAL DE CAPÍTULO
// ==========================================
const manualVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

function ChapterCarousel({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const [[page, direction], setPage] = useState([0, 0]);

  const slides: Slide[] = [];
  if (chapter.connectorText) {
    slides.push({ type: "intro", content: chapter.connectorText, duration: 4000 });
  }

  const imageOrder = getChapterImageOrder(chapter.id, chapter.imageCount);
  if (chapter.id === "postureos") {
    const images = imageOrder.map((imgNum) => `${chapter.folder}/${imgNum}.jpg`);
    slides.push({
      type: "mosaic",
      images,
      text: "muchos outfits y espejos , tantos que no me cabían todas las fotos...",
      duration: 0,
    });
  } else {
    imageOrder.forEach((imgNum) => {
      const src = `${chapter.folder}/${imgNum}.jpg`;
      slides.push({
        type: "image",
        src,
        duration: 0,
        caption: PHOTO_CAPTIONS[src],
      });
    });
  }

  if (chapter.closingText) {
    slides.push({ type: "closing", content: chapter.closingText, duration: 4000 });
  }

  const activeIndex = page;
  const activeSlide = slides[activeIndex];

  const paginate = (newDirection: number) => {
    const next = page + newDirection;
    if (next >= 0 && next < slides.length) {
      setPage([next, newDirection]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-50 rounded-full bg-black/60 border border-white/20 p-2.5 text-white backdrop-blur-md transition hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Texto superior flotante para el carrusel manual (con suficiente margen bajo el botón cerrar) */}
      <div className="absolute top-20 sm:top-22 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-6 text-center max-w-xl w-full">
        <AnimatePresence mode="wait">
          {activeSlide.type === "image" && activeSlide.caption && (
            <motion.p
              key={activeSlide.caption}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-lg sm:text-2xl md:text-3xl font-medium tracking-wide text-pink-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] select-none leading-snug"
            >
              {activeSlide.caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex h-full w-full max-w-4xl items-center justify-center overflow-hidden px-4 sm:px-12">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={manualVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) paginate(1);
              else if (swipe > 10000) paginate(-1);
            }}
            className="flex h-full w-full items-center justify-center p-4"
          >
            {activeSlide.type === "intro" || activeSlide.type === "closing" ? (
              <div className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-xl">
                <p className="font-serif text-lg leading-relaxed text-white/90">
                  {activeSlide.content}
                </p>
              </div>
            ) : activeSlide.type === "mosaic" ? (
              <PostureoMosaic images={activeSlide.images} text={activeSlide.text} />
            ) : activeSlide.type === "image" ? (
              activeSlide.src === "/gallery/6_felicidad/23.jpg" ? (
                <InteractivePolaroid
                  imageSrc={activeSlide.src}
                  secretNote="Busca detrás de la funda de mi móvil"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeSlide.src}
                    alt={`Imagen ${page}`}
                    style={
                      IMAGE_ROTATIONS[activeSlide.src]
                        ? {
                            transform: `rotate(${IMAGE_ROTATIONS[activeSlide.src]}deg)`,
                            maxHeight: "75vw",
                            maxWidth: "75vh",
                          }
                        : undefined
                    }
                    className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                    draggable={false}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              )
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="pointer-events-auto rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="font-mono text-sm text-white/60">
          {page + 1} / {slides.length}
        </span>
        <button
          onClick={() => paginate(1)}
          disabled={page === slides.length - 1}
          className="pointer-events-auto rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
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
            className="flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-pink-600 active:scale-95"
          >
            <Play className="h-5 w-5 fill-white" />
            Ver nuestra historia
          </button>
        </motion.div>
      )}

      {/* Fase 2: Slideshow */}
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
            <p className="text-sm text-white/70">Tómate tu tiempo para revivirla.</p>
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

      {/* Visor de Carrusel Manual (Sobre la Fase 3) */}
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
