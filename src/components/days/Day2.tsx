"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Play, Pause } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";
import { InteractivePolaroid } from "@/components/effects/InteractivePolaroid";
import { PostureoMosaic } from "./PostureoMosaic";
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
// TIPOS DE ESCENA (MEMORIES EDITORIAL)
// ==========================================
export type MosaicVariant =
  | "polaroid"
  | "offset"
  | "stack"
  | "hero"
  | "scrapbook"
  | "duo_top";

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
      type: "postureo_mosaic";
      id: string;
      chapterId: string;
      chapterIndex: number;
      chapterTitle: string;
      images: string[];
      text?: string;
      duration: number;
    }
  | {
      type: "mosaic_text";
      id: string;
      chapterId: string;
      chapterIndex: number;
      chapterTitle: string;
      images: string[];
      caption?: string;
      variant?: MosaicVariant;
      duration: number;
    }
  | {
      type: "image";
      id: string;
      chapterId: string;
      chapterIndex: number;
      chapterTitle: string;
      src: string;
      caption?: string;
      duration: number;
    }
  | {
      type: "end";
      id: string;
      text: string;
      duration: number;
    };

// Construye las escenas de un capítulo individual
function buildChapterScenes(ch: Chapter): Scene[] {
  const sceneList: Scene[] = [];
  const chIdx = chapters.findIndex((c) => c.id === ch.id);

  // 1. Diapositiva Intersticial de Entrada
  if (ch.connectorText) {
    const duration = Math.max(4800, ch.connectorText.length * 32 + 1600);
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

  // 2. SECCIÓN 2: POSTUREOS (>25 fotos) -> Mosaico dinámico de selfies frente al espejo
  if (ch.id === "postureos") {
    const imageOrder = getChapterImageOrder(ch.id, ch.imageCount);
    const images = imageOrder.map((num) => `${ch.folder}/${num}.jpg`);
    sceneList.push({
      type: "postureo_mosaic",
      id: `postureo-mosaic-${ch.id}`,
      chapterId: ch.id,
      chapterIndex: chIdx,
      chapterTitle: ch.title,
      images,
      text: ch.closingText || "muchos outfits y espejos , tantos que no me cabían todas las fotos...",
      duration: 20000,
    });
    return sceneList;
  }

  // 3. SECCIÓN 3: VIAJES -> Mosaicos pequeños y dinámicos con fotos del mismo texto (sin barras alargadas ni recortes)
  if (ch.id === "viajes") {
    const mosaicConfigs: {
      nums: number[];
      caption?: string;
      variant: MosaicVariant;
      duration: number;
    }[] = [
      {
        nums: [3, 4],
        caption: "Nuestra primera escapada juntos...",
        variant: "polaroid",
        duration: 3000,
      },
      {
        nums: [5, 6, 7],
        caption: "Nuestra primera escapada juntos...",
        variant: "hero",
        duration: 3600,
      },
      {
        nums: [15, 16],
        caption: "Valencia y nuestro segundo Voltereta...",
        variant: "offset",
        duration: 3000,
      },
      {
        nums: [17, 18],
        caption: "Valencia y nuestro segundo Voltereta...",
        variant: "polaroid",
        duration: 3000,
      },
      {
        nums: [19, 20],
        caption: "Valencia y nuestro segundo Voltereta...",
        variant: "offset",
        duration: 3000,
      },
      {
        nums: [32, 33],
        caption: "Primer eclipse juntos ❤️",
        variant: "stack",
        duration: 3200,
      },
      {
        nums: [34, 35, 36],
        caption: "Nuestra primera vez en la playa juntos 🥰",
        variant: "hero",
        duration: 3600,
      },
    ];

    const imageOrder = getChapterImageOrder(ch.id, ch.imageCount);
    let i = 0;
    while (i < imageOrder.length) {
      const num = imageOrder[i];
      const cfg = mosaicConfigs.find(
        (c) =>
          c.nums[0] === num &&
          c.nums.every((cn, cIdx) => imageOrder[i + cIdx] === cn)
      );

      if (cfg) {
        sceneList.push({
          type: "mosaic_text",
          id: `mosaic-${ch.id}-${num}`,
          chapterId: ch.id,
          chapterIndex: chIdx,
          chapterTitle: ch.title,
          images: cfg.nums.map((n) => `${ch.folder}/${n}.jpg`),
          caption: cfg.caption,
          variant: cfg.variant,
          duration: cfg.duration,
        });
        i += cfg.nums.length;
      } else {
        const src = `${ch.folder}/${num}.jpg`;
        sceneList.push({
          type: "image",
          id: `img-${ch.id}-${num}`,
          chapterId: ch.id,
          chapterIndex: chIdx,
          chapterTitle: ch.title,
          src,
          caption: PHOTO_CAPTIONS[src],
          duration: 950, // Velocidad 1.9x
        });
        i++;
      }
    }
  } else if (ch.id === "cara_b") {
    // 4. SECCIÓN 4: CARA B -> Mosaicos pequeños variados de mismo contexto (máximo 3 fotos)
    const mosaicConfigs: {
      nums: number[];
      variant: MosaicVariant;
      duration: number;
    }[] = [
      { nums: [5, 6], variant: "polaroid", duration: 2800 },
      { nums: [10, 11], variant: "offset", duration: 2800 },
      { nums: [15, 16], variant: "stack", duration: 2800 },
      { nums: [17, 18, 19], variant: "scrapbook", duration: 3500 },
      { nums: [21, 22], variant: "polaroid", duration: 2800 },
      { nums: [27, 28], variant: "offset", duration: 2800 },
      { nums: [29, 30, 31], variant: "hero", duration: 3500 },
      { nums: [34, 35], variant: "polaroid", duration: 2800 },
      { nums: [43, 44], variant: "offset", duration: 2800 },
      { nums: [46, 47], variant: "polaroid", duration: 2800 },
      { nums: [50, 51], variant: "offset", duration: 2800 },
    ];

    const imageOrder = getChapterImageOrder(ch.id, ch.imageCount);
    let i = 0;
    while (i < imageOrder.length) {
      const num = imageOrder[i];
      const cfg = mosaicConfigs.find(
        (c) =>
          c.nums[0] === num &&
          c.nums.every((cn, cIdx) => imageOrder[i + cIdx] === cn)
      );

      if (cfg) {
        sceneList.push({
          type: "mosaic_text",
          id: `mosaic-${ch.id}-${num}`,
          chapterId: ch.id,
          chapterIndex: chIdx,
          chapterTitle: ch.title,
          images: cfg.nums.map((n) => `${ch.folder}/${n}.jpg`),
          variant: cfg.variant,
          duration: cfg.duration,
        });
        i += cfg.nums.length;
      } else {
        const src = `${ch.folder}/${num}.jpg`;
        sceneList.push({
          type: "image",
          id: `img-${ch.id}-${num}`,
          chapterId: ch.id,
          chapterIndex: chIdx,
          chapterTitle: ch.title,
          src,
          caption: PHOTO_CAPTIONS[src],
          duration: 950, // Velocidad 1.9x
        });
        i++;
      }
    }
  } else {
    // 5. DEMÁS SECCIONES (inicios, duros, felicidad): Fotos originales individuales
    const imgDuration = ch.imageCount > 15 ? 950 : 2200;
    const imageOrder = getChapterImageOrder(ch.id, ch.imageCount);

    imageOrder.forEach((num) => {
      const src = `${ch.folder}/${num}.jpg`;
      const duration = ch.id === "felicidad" && num === 23 ? 6500 : imgDuration;
      sceneList.push({
        type: "image",
        id: `img-${ch.id}-${num}`,
        chapterId: ch.id,
        chapterIndex: chIdx,
        chapterTitle: ch.title,
        src,
        caption: PHOTO_CAPTIONS[src],
        duration,
      });
    });
  }

  // Diapositiva Intersticial de Cierre del Capítulo
  if (ch.closingText) {
    const duration = Math.max(4800, ch.closingText.length * 32 + 1600);
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

  return sceneList;
}

// Construye la lista completa de escenas de todos los capítulos
function buildEditorialScenes(): Scene[] {
  const sceneList: Scene[] = [];

  chapters.forEach((ch) => {
    sceneList.push(...buildChapterScenes(ch));
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
    if (isPaused || charCount >= text.length) return;
    const timeout = setTimeout(() => {
      setCharCount((count) => count + 1);
    }, 32);
    return () => clearTimeout(timeout);
  }, [text.length, isPaused, charCount]);

  return (
    <p className="font-serif text-2xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-loose text-white/95 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
      {text.slice(0, charCount)}
      {charCount < text.length && (
        <span className="ml-1.5 inline-block h-[0.9em] w-[2px] animate-pulse bg-petal-400 align-middle shadow-[0_0_12px_rgba(244,114,182,0.9)]" />
      )}
    </p>
  );
}

// ==========================================
// COMPONENTE: MOSAICOS PEQUEÑOS DINÁMICOS
// (Sin barras alargadas, sin recortes de personas)
// ==========================================
function SmallMosaicLayout({
  images,
  variant,
}: {
  images: string[];
  variant?: MosaicVariant;
}) {
  const chosenVariant: MosaicVariant =
    variant || (images.length === 3 ? "hero" : "polaroid");

  if (images.length === 2) {
    if (chosenVariant === "stack") {
      return (
        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm h-full max-h-[64vh] px-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative flex items-center justify-center p-1.5 bg-white/10 border border-petal-400/30 rounded-2xl shadow-xl backdrop-blur-sm max-h-[29vh] w-auto max-w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Recuerdo ${idx + 1}`}
                style={
                  IMAGE_ROTATIONS[img]
                    ? { transform: `rotate(${IMAGE_ROTATIONS[img]}deg)` }
                    : undefined
                }
                className="max-h-[26vh] max-w-full w-auto h-auto object-contain rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (chosenVariant === "offset") {
      return (
        <div className="relative flex flex-col justify-between w-full max-w-sm h-[62vh] px-3 py-1">
          {/* Foto 1: alineada arriba a la izquierda */}
          <div className="self-start max-w-[66vw] max-h-[31vh] p-1.5 bg-white/10 border border-petal-400/30 rounded-2xl shadow-2xl backdrop-blur-sm z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt="Recuerdo 1"
              style={
                IMAGE_ROTATIONS[images[0]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[0]]}deg)` }
                  : undefined
              }
              className="max-h-[28vh] max-w-full w-auto h-auto object-contain rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          {/* Foto 2: alineada abajo a la derecha */}
          <div className="self-end max-w-[66vw] max-h-[31vh] p-1.5 bg-white/10 border border-petal-400/30 rounded-2xl shadow-2xl backdrop-blur-sm -mt-4 z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[1]}
              alt="Recuerdo 2"
              style={
                IMAGE_ROTATIONS[images[1]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[1]]}deg)` }
                  : undefined
              }
              className="max-h-[28vh] max-w-full w-auto h-auto object-contain rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      );
    }

    // Default 2 fotos: "polaroid" (superpuestas e inclinadas de forma orgánica)
    return (
      <div className="relative flex items-center justify-center w-full max-w-sm h-[62vh] px-2">
        {/* Foto 1: inclinada -3 grados */}
        <div className="absolute left-2 top-4 z-10 max-w-[64vw] max-h-[36vh] p-2 bg-gradient-to-br from-white/95 to-rose-50/95 rounded-2xl shadow-2xl border border-white/50 -rotate-3 transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt="Recuerdo 1"
            style={
              IMAGE_ROTATIONS[images[0]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[0]]}deg)` }
                : undefined
            }
            className="max-h-[31vh] max-w-full w-auto h-auto object-contain rounded-xl"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        {/* Foto 2: inclinada +3 grados, solapando suavemente */}
        <div className="absolute right-2 bottom-4 z-20 max-w-[64vw] max-h-[36vh] p-2 bg-gradient-to-br from-white/95 to-rose-50/95 rounded-2xl shadow-2xl border border-white/50 rotate-3 transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[1]}
            alt="Recuerdo 2"
            style={
              IMAGE_ROTATIONS[images[1]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[1]]}deg)` }
                : undefined
            }
            className="max-h-[31vh] max-w-full w-auto h-auto object-contain rounded-xl"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    );
  }

  // 3 fotos
  if (chosenVariant === "duo_top") {
    return (
      <div className="flex flex-col items-center justify-center gap-2.5 w-full max-w-sm h-full max-h-[66vh] px-2">
        <div className="flex items-center justify-center gap-2 w-full max-h-[28vh]">
          <div className="flex-1 flex items-center justify-center p-1 bg-white/10 border border-petal-400/30 rounded-xl shadow-lg backdrop-blur-sm max-h-[27vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt="Recuerdo 1"
              style={
                IMAGE_ROTATIONS[images[0]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[0]]}deg)` }
                  : undefined
              }
              className="max-h-[25vh] max-w-full w-auto h-auto object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 flex items-center justify-center p-1 bg-white/10 border border-petal-400/30 rounded-xl shadow-lg backdrop-blur-sm max-h-[27vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[1]}
              alt="Recuerdo 2"
              style={
                IMAGE_ROTATIONS[images[1]]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[images[1]]}deg)` }
                  : undefined
              }
              className="max-h-[25vh] max-w-full w-auto h-auto object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
        {/* Hero inferior */}
        <div className="flex items-center justify-center p-1.5 bg-white/10 border border-petal-400/30 rounded-2xl shadow-xl backdrop-blur-sm max-h-[33vh] w-auto max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[2]}
            alt="Recuerdo 3"
            style={
              IMAGE_ROTATIONS[images[2]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[2]]}deg)` }
                : undefined
            }
            className="max-h-[30vh] max-w-full w-auto h-auto object-contain rounded-xl"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    );
  }

  if (chosenVariant === "scrapbook") {
    return (
      <div className="relative flex items-center justify-center w-full max-w-sm h-[64vh] px-2">
        {/* Foto 1: superior izquierda con inclinación -4 */}
        <div className="absolute top-2 left-1 z-10 max-w-[50vw] max-h-[28vh] p-1.5 bg-white/95 rounded-xl shadow-xl -rotate-4 border border-rose-200/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt="Recuerdo 1"
            style={
              IMAGE_ROTATIONS[images[0]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[0]]}deg)` }
                : undefined
            }
            className="max-h-[24vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        {/* Foto 2: superior derecha con inclinación +3 */}
        <div className="absolute top-6 right-1 z-20 max-w-[48vw] max-h-[26vh] p-1.5 bg-white/95 rounded-xl shadow-xl rotate-3 border border-rose-200/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[1]}
            alt="Recuerdo 2"
            style={
              IMAGE_ROTATIONS[images[1]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[1]]}deg)` }
                : undefined
            }
            className="max-h-[22vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        {/* Foto 3: inferior centro solapada */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 max-w-[56vw] max-h-[30vh] p-1.5 bg-white/95 rounded-xl shadow-2xl -rotate-1 border border-petal-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[2]}
            alt="Recuerdo 3"
            style={
              IMAGE_ROTATIONS[images[2]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[2]]}deg)` }
                : undefined
            }
            className="max-h-[26vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    );
  }

  // Default 3 fotos: "hero" (1 hero arriba + 2 dúo abajo)
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 w-full max-w-sm h-full max-h-[66vh] px-2">
      {/* Hero superior */}
      <div className="flex items-center justify-center p-1.5 bg-white/10 border border-petal-400/30 rounded-2xl shadow-xl backdrop-blur-sm max-h-[33vh] w-auto max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0]}
          alt="Recuerdo 1"
          style={
            IMAGE_ROTATIONS[images[0]]
              ? { transform: `rotate(${IMAGE_ROTATIONS[images[0]]}deg)` }
              : undefined
          }
          className="max-h-[30vh] max-w-full w-auto h-auto object-contain rounded-xl"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Dúo inferior */}
      <div className="flex items-center justify-center gap-2 w-full max-h-[28vh]">
        <div className="flex-1 flex items-center justify-center p-1 bg-white/10 border border-petal-400/30 rounded-xl shadow-lg backdrop-blur-sm max-h-[27vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[1]}
            alt="Recuerdo 2"
            style={
              IMAGE_ROTATIONS[images[1]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[1]]}deg)` }
                : undefined
            }
            className="max-h-[25vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="flex-1 flex items-center justify-center p-1 bg-white/10 border border-petal-400/30 rounded-xl shadow-lg backdrop-blur-sm max-h-[27vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[2]}
            alt="Recuerdo 3"
            style={
              IMAGE_ROTATIONS[images[2]]
                ? { transform: `rotate(${IMAGE_ROTATIONS[images[2]]}deg)` }
                : undefined
            }
            className="max-h-[25vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: RENDERIZADOR UNIVERSAL DE ESCENA
// ==========================================
function SceneContentRenderer({
  scene,
  isPaused,
  speed,
  onFinish,
  onPostureoComplete,
}: {
  scene: Scene;
  isPaused: boolean;
  speed: number;
  onFinish: () => void;
  onPostureoComplete?: () => void;
}) {
  if (scene.type === "interstitial") {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-8 max-w-xl mx-auto rounded-3xl border border-petal-400/30 bg-gradient-to-b from-[#1b0a2a]/95 to-[#0d0317]/98 p-8 shadow-2xl backdrop-blur-xl">
        {scene.subtitle && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-petal-300 mb-3 px-3.5 py-1 rounded-full border border-petal-400/30 bg-petal-500/15">
            {scene.subtitle}
          </span>
        )}
        <SubtleTypewriterText key={scene.text} text={scene.text} isPaused={isPaused} />
      </div>
    );
  }

  if (scene.type === "postureo_mosaic") {
    return (
      <PostureoMosaic
        images={scene.images}
        text={scene.text}
        isPaused={isPaused}
        speed={speed}
        onComplete={onPostureoComplete}
      />
    );
  }

  if (scene.type === "mosaic_text") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full max-h-[75vh] max-w-md mx-auto p-2">
        {scene.caption && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2.5 text-center shrink-0 z-30"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/80 border border-petal-400/40 text-xs sm:text-sm font-serif italic text-petal-200 backdrop-blur-md shadow-lg">
              {scene.caption}
            </span>
          </motion.div>
        )}

        <SmallMosaicLayout images={scene.images} variant={scene.variant} />
      </div>
    );
  }

  if (scene.type === "image") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full max-h-[75vh] max-w-md mx-auto p-2">
        {scene.caption && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2.5 text-center shrink-0 z-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/75 border border-petal-400/40 text-xs sm:text-sm font-serif italic text-petal-200 backdrop-blur-md shadow-lg">
              {scene.caption}
            </span>
          </motion.div>
        )}

        {scene.src === "/gallery/6_felicidad/23.jpg" ? (
          <InteractivePolaroid
            imageSrc={scene.src}
            secretNote="Busca detrás de la funda de mi móvil"
          />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full max-h-[66vh] overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-2 shadow-2xl backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scene.src}
              alt="Recuerdo"
              style={
                IMAGE_ROTATIONS[scene.src]
                  ? { transform: `rotate(${IMAGE_ROTATIONS[scene.src]}deg)` }
                  : undefined
              }
              className="max-h-[62vh] max-w-full w-auto h-auto object-contain rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (scene.type === "end") {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-8 max-w-md mx-auto rounded-3xl border border-petal-400/40 bg-gradient-to-b from-[#2a0e36] to-[#0c0312] p-8 shadow-2xl">
        <SubtleTypewriterText key={scene.text} text={scene.text} isPaused={isPaused} />
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
          className="mt-6 rounded-full bg-gradient-to-r from-petal-500 to-petal-600 px-7 py-3 font-semibold text-white shadow-xl transition hover:brightness-110 active:scale-95"
        >
          Ir a la Galería
        </motion.button>
      </div>
    );
  }

  return null;
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
  const elapsedRef = useRef(0);
  const speedRef = useRef(speed);

  // Sincronizar speedRef si cambia speed
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const goToPrev = useCallback(() => {
    if (index > 0) {
      hapticTap();
      setDirection(-1);
      elapsedRef.current = 0;
      setProgressPercent(0);
      setIndex((prev) => prev - 1);
    }
  }, [index]);

  const goToNext = useCallback(() => {
    if (index < scenes.length - 1) {
      hapticTap();
      setDirection(1);
      elapsedRef.current = 0;
      setProgressPercent(0);
      setIndex((prev) => prev + 1);
    } else {
      onFinish();
    }
  }, [index, scenes.length, onFinish]);

  // Timer de Autoplay (no depende de speed para no reiniciar la foto al cambiar de velocidad)
  useEffect(() => {
    if (isPaused) return;

    let lastTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      elapsedRef.current += delta * speedRef.current;
      const targetDuration = activeScene.duration;
      const pct = Math.min(100, (elapsedRef.current / targetDuration) * 100);
      setProgressPercent(pct);

      if (elapsedRef.current >= targetDuration) {
        goToNext();
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [index, activeScene.duration, isPaused, goToNext]);

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
      const next = prev === 1.0 ? 1.5 : prev === 1.5 ? 2.0 : prev === 2.0 ? 0.6 : 1.0;
      speedRef.current = next;
      return next;
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
                  className="h-full bg-petal-400 transition-none"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Cabecera con título del capítulo y botón saltar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-petal-300/80 font-medium">
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
              <span className="rounded-full border border-petal-500/40 bg-petal-500/20 px-2.5 py-0.5 text-[11px] font-medium text-petal-300 animate-pulse">
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
            {/* RENDERIZADO UNIVERSAL DE ESCENA */}
            <SceneContentRenderer
              scene={activeScene}
              isPaused={isPaused}
              speed={speed}
              onFinish={onFinish}
              onPostureoComplete={goToNext}
            />
          </motion.div>
        </AnimatePresence>

        {/* DOUBLE BUFFERING: Pre-carga en memoria invisible de las imágenes de la siguiente escena */}
        {nextScene && (
          <div className="hidden" aria-hidden="true">
            {nextScene.type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={nextScene.src} alt="preload" loading="eager" />
            )}
            {nextScene.type === "mosaic_text" &&
              nextScene.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img} src={img} alt="preload" loading="eager" />
              ))}
            {nextScene.type === "postureo_mosaic" &&
              nextScene.images.slice(0, 8).map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img} src={img} alt="preload" loading="eager" />
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
                ? "bg-petal-500 text-white ring-4 ring-petal-500/30"
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
            className="flex h-9 px-3.5 items-center justify-center rounded-full bg-white/10 border border-white/20 text-xs font-mono font-medium text-petal-300 backdrop-blur-md active:scale-95 shadow-md"
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
  const scenes = useMemo(() => buildChapterScenes(chapter), [chapter]);
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
            <SceneContentRenderer
              scene={activeScene}
              isPaused={false}
              speed={1.0}
              onFinish={onClose}
            />
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
            className="flex items-center gap-2 rounded-full bg-petal-500 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-petal-600 active:scale-95 shadow-lg"
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-petal-300">
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
