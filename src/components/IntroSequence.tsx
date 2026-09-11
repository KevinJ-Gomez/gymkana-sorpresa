"use client";

import { motion } from "framer-motion";

/**
 * Intro cinemática. El texto se revela escalonado sobre la nebulosa vista de
 * lejos, y el botón dispara el salto a hiperespacio: a partir de ahí manda la
 * escena 3D, así que este overlay solo tiene que quitarse de en medio rápido.
 */

const NARRATIVE = [
  "Hoy comienza nuestro viaje juntos, además de empezar una cuentra atrás para tus 30 cumpleaños.",
  "Durante los próximos 11 días, cada reto que completes te acercará a una sorpresa, cada una de ellas elegidas por mi y otras personas que te quieren mucho (no tanto como yo), con mucho amor y cariño especialmente para ti.",
  "Como no teníamos espacio en las maletas, alguno de las sorpresas se han quedado en Zaragoza esperándote.",
  "Pero hay una pequeña excepción... algo que vas a necesitar para esta aventura.",
];

/** Cierre destacado, con más peso tipográfico que el resto de la narrativa. */
const CLOSER = "Once días. Once estrellas.";
const CLOSER_SUB = "Enciéndelas todas y descubre qué te hemos preparado.";

const LINE_DELAY = 0.75;
const FIRST_LINE_AT = 0.9;
const CLOSER_AT = FIRST_LINE_AT + NARRATIVE.length * LINE_DELAY + 0.2;
const BUTTON_AT = CLOSER_AT + 0.9;

export function IntroSequence({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Sale deprisa: en cuanto arranca el salto, el protagonista es el 3D.
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      className="journey-intro fixed inset-0 z-30 flex flex-col justify-between overflow-y-auto overscroll-contain
        bg-[radial-gradient(ellipse_at_center,rgba(21,6,28,0.85),rgba(15,3,26,0.98))]
        px-6 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-center shrink-0"
      >
        <div className="intro-number text-4xl sm:text-5xl font-serif italic text-petal-300" aria-hidden="true">
          XI
        </div>
        <p className="mt-2 text-xs font-serif uppercase tracking-[0.3em] text-petal-200/80">
          2 — 12 de octubre
        </p>
      </motion.div>

      <div className="intro-narrative my-auto py-4 space-y-4 max-w-md mx-auto text-center">
        {NARRATIVE.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: FIRST_LINE_AT + index * LINE_DELAY, ease: "easeOut" }}
            className="text-balance font-serif text-base sm:text-lg leading-relaxed text-[#fcf4f7]"
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: CLOSER_AT, ease: "easeOut" }}
          className="pt-3 border-t border-petal-400/30"
        >
          <p className="font-serif text-2xl sm:text-3xl font-semibold leading-snug text-white">
            {CLOSER}
          </p>
          <span className="mt-1.5 block font-serif italic text-sm sm:text-base text-petal-200/90">
            {CLOSER_SUB}
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: BUTTON_AT, ease: "easeOut" }}
        className="space-y-3 shrink-0 max-w-md mx-auto w-full"
      >
        <motion.button
          type="button"
          onClick={onStart}
          whileTap={{ scale: 0.96 }}
          className="primary-action flex w-full items-center justify-center gap-2.5 rounded-full
            bg-gradient-to-r from-petal-500 via-petal-600 to-petal-700
            px-6 py-4 sm:py-5 text-base sm:text-lg font-serif font-bold text-white shadow-xl"
        >
          Comenzar Viaje 💌
        </motion.button>

        <p className="text-center text-xs font-serif italic text-white/50">
          Prepárate para el salto
        </p>
      </motion.div>
    </motion.div>
  );
}
