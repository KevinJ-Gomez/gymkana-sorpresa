"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, FastForward, Play } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

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
      "Empezamos esta aventura casi sin darnos cuenta. Aquí están nuestros primeros recuerdos...",
    folder: "/gallery/1_inicios",
    imageCount: 15,
  },
  {
    id: "postureos",
    title: "Postureos y Modelaje",
    connectorText:
      "Poco a poco fuimos ganando confianza, tanta que pronto descubrí que, para ti, cualquier espejo es la excusa perfecta para una foto o un recuerdo.",
    folder: "/gallery/2_postureo",
    imageCount: 20,
  },
  {
    id: "viajes",
    title: "Conociendo mundo",
    connectorText:
      "Después de dominar todos los espejos que nos íbamos encontrando, empezamos a conocer mundo juntos.",
    folder: "/gallery/3_viajes",
    imageCount: 30,
  },
  {
    id: "cara_b",
    title: "La Cara B",
    connectorText:
      "Aunque, no todo en nuestra vida es postureo... que conste que no hago malas fotos, veo la vida de otra 'forma'.",
    folder: "/gallery/4_intimas",
    imageCount: 15,
  },
  {
    id: "duros",
    title: "Apretando los dientes",
    connectorText:
      "Pero más allá de los viajes y las risas, también nos ha tocado apretar los dientes. La vida a veces se hace un poco cuesta arriba, pero juntos hemos sabido sostenernos en los momentos más duros y difíciles.",
    folder: "/gallery/5_duros",
    imageCount: 10,
  },
  {
    id: "felicidad",
    title: "Superación y Cariño",
    connectorText:
      "Y precisamente por habernos sostenido en lo malo, ahora sabemos disfrutar, exprimir cada sonrisa y querernos en lo bueno.",
    closingText:
      "Juntos hemos podido superar siempre los malos momentos y así será siempre.",
    folder: "/gallery/6_felicidad",
    imageCount: 20,
  },
];

// ==========================================
// FASE 2: REPRODUCTOR SLIDESHOW AUTOMÁTICO
// ==========================================
type Slide =
  | { type: "intro"; content: string; duration: number }
  | { type: "image"; src: string; duration: number }
  | { type: "closing"; content: string; duration: number }
  | { type: "end"; content: string; duration: number };

function SlideshowPlayer({ onFinish }: { onFinish: () => void }) {
  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [];
    chapters.forEach((ch) => {
      // Tarjeta de texto inicial del capítulo
      if (ch.connectorText) {
        list.push({ type: "intro", content: ch.connectorText, duration: 4000 });
      }
      // Imágenes: distribuimos unos 10-15 segundos por capítulo en total.
      const imgDuration = Math.min(2500, Math.max(300, 15000 / ch.imageCount));
      for (let i = 1; i <= ch.imageCount; i++) {
        list.push({ type: "image", src: `${ch.folder}/${i}.jpg`, duration: imgDuration });
      }
      if (ch.closingText) {
        list.push({ type: "closing", content: ch.closingText, duration: 4000 });
      }
    });
    list.push({
      type: "end",
      content: "Pregúntame por una pequeña sorpresa... (tienes tu premio físico esperándote)",
      duration: 6000,
    });
    return list;
  }, []);

  const [index, setIndex] = useState(0);
  const activeSlide = slides[index];

  // Controlador de velocidad con Joystick
  const joystickX = useMotionValue(0);
  // Mapeamos: -80px -> cámara lenta (0.2x), 0 -> normal (1x), 80px -> muy rápido (6x)
  const speedMultiplier = useTransform(joystickX, [-80, 0, 80], [0.15, 1, 8]);
  
  // Progreso visual (barra superior)
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
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
  }, [index, activeSlide.duration, slides.length, onFinish, speedMultiplier]);

  const handleDragEnd = () => {
    // Al soltar el joystick, vuelve al centro
    animate(joystickX, 0, { type: "spring", stiffness: 300, damping: 20 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      {/* Botón Saltar */}
      <button
        onClick={onFinish}
        className="absolute right-6 top-6 z-50 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
      >
        Saltar
      </button>

      {/* Barra de progreso de la diapositiva actual */}
      <div className="absolute left-0 top-0 h-1 w-full bg-white/10">
        <motion.div
          className="h-full bg-pink-400"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          transition={{ duration: 0 }}
        />
      </div>

      {/* Slide Content */}
      <div className="relative flex h-full w-full items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full items-center justify-center"
          >
            {activeSlide.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeSlide.src}
                alt="Slideshow image"
                className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="max-w-xl rounded-2xl border border-white/20 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl">
                <p className="font-serif text-2xl leading-relaxed text-white">
                  {activeSlide.content}
                </p>
                {activeSlide.type === "end" && (
                  <button
                    onClick={onFinish}
                    className="mt-8 rounded-full bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
                  >
                    Ir a la Galería
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Joystick Controlador de Velocidad */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <div className="flex w-64 items-center justify-between px-2 text-xs text-white/50">
          <span>🐢 Lento</span>
          <span>Velocidad</span>
          <span>Rápido 🐇</span>
        </div>
        <div className="relative flex h-14 w-64 items-center rounded-full bg-white/10 backdrop-blur-md shadow-inner">
          <div className="absolute left-1/2 h-4 w-1 -translate-x-1/2 rounded bg-white/20" />
          <motion.div
            drag="x"
            dragConstraints={{ left: -80, right: 80 }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x: joystickX }}
            className="absolute left-1/2 ml-[calc(-1.75rem/2)] flex h-7 w-7 cursor-grab items-center justify-center rounded-full bg-white shadow-lg active:cursor-grabbing"
          >
            <div className="h-4 w-4 rounded-full bg-pink-500" />
          </motion.div>
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
  for (let i = 1; i <= chapter.imageCount; i++) {
    slides.push({ type: "image", src: `${chapter.folder}/${i}.jpg`, duration: 0 });
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
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

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
            className="absolute flex h-full w-full items-center justify-center p-4"
          >
            {activeSlide.type === "intro" || activeSlide.type === "closing" ? (
              <div className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-xl">
                <p className="font-serif text-lg leading-relaxed text-white/90">
                  {activeSlide.content}
                </p>
              </div>
            ) : activeSlide.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeSlide.src}
                alt={`Imagen ${page}`}
                className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                draggable={false}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
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
