"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

// ==========================================
// ESTRUCTURA DE DATOS
// ==========================================
interface Chapter {
  id: string;
  title: string;
  connectorText: string;
  folder: string;
  imageCount: number;
  closingText?: string;
}

const chapters: Chapter[] = [
  {
    id: "inicios",
    title: "Los Inicios",
    connectorText:
      "Poco a poco fuimos ganando confianza, tanta que pronto descubrí que, para ti, cualquier espejo es la excusa perfecta para una foto o un recuerdo.",
    folder: "/gallery/1_inicios",
    imageCount: 15,
  },
  {
    id: "postureos",
    title: "Postureos y Modelaje",
    connectorText:
      "Después de dominar todos los espejos que nos íbamos encontrando, empezamos a conocer mundo juntos.",
    folder: "/gallery/2_postureo",
    imageCount: 20,
  },
  {
    id: "viajes",
    title: "Conociendo mundo",
    connectorText:
      "Aunque, no todo en nuestra vida es postureo... que conste que no hago malas fotos, veo la vida de otra 'forma'.",
    folder: "/gallery/3_viajes",
    imageCount: 30,
  },
  {
    id: "cara_b",
    title: "La Cara B",
    connectorText:
      "Pero más allá de los viajes y las risas, también nos ha tocado apretar los dientes. La vida a veces se hace un poco cuesta arriba, pero juntos hemos sabido sostenernos en los momentos más duros y difíciles.",
    folder: "/gallery/4_intimas",
    imageCount: 15,
  },
  {
    id: "duros",
    title: "Apretando los dientes",
    connectorText:
      "Y precisamente por habernos sostenido en lo malo, ahora sabemos disfrutar, exprimir cada sonrisa y querernos en lo bueno.",
    folder: "/gallery/5_duros",
    imageCount: 10,
  },
  {
    id: "felicidad",
    title: "Superación y Cariño",
    closingText:
      "Juntos hemos podido superar siempre los malos momentos y así será siempre.",
    folder: "/gallery/6_felicidad",
    imageCount: 20,
  },
];

// ==========================================
// CARRUSEL
// ==========================================

// Configuración de las animaciones del slider
const variants = {
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

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

function ChapterCarousel({
  chapter,
  onClose,
}: {
  chapter: Chapter;
  onClose: () => void;
}) {
  const [[page, direction], setPage] = useState([0, 0]);

  // Generamos todos los slides para este capítulo
  const slides = [{ type: "intro", content: chapter.connectorText }];
  for (let i = 1; i <= chapter.imageCount; i++) {
    slides.push({ type: "image", content: `${chapter.folder}/${i}.jpg` });
  }
  if (chapter.closingText) {
    slides.push({ type: "closing", content: chapter.closingText });
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
      {/* Botón Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Contenedor del Slide */}
      <div className="relative flex h-full w-full max-w-4xl items-center justify-center overflow-hidden px-4 sm:px-12">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute flex h-full w-full items-center justify-center p-4"
          >
            {activeSlide.type === "intro" || activeSlide.type === "closing" ? (
              <div className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-xl">
                <p className="font-serif text-lg leading-relaxed text-white/90">
                  {activeSlide.content}
                </p>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeSlide.content}
                alt={`Imagen ${page} del capítulo`}
                className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                draggable={false} // Evita el arrastre nativo de la imagen para que funcione Framer Motion
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles y progreso */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="pointer-events-auto rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <span className="font-mono text-sm text-white/60">
          {page + 1} / {slides.length}
        </span>
        
        <button
          onClick={() => paginate(1)}
          disabled={page === slides.length - 1}
          className="pointer-events-auto rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL DEL DÍA 2
// ==========================================

export function Day2({ config, isUnlocked }: DayComponentProps) {
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  if (!isUnlocked) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{config.rewardTitle}</h3>
        {config.rewardDescription && (
          <p className="text-sm leading-relaxed text-white/80">
            {config.rewardDescription}
          </p>
        )}
      </div>

      {/* Grid de Portadas de Capítulos (Glassmorphism) */}
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

      {/* Visor de Carrusel */}
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
