"use client";

import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";

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
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      className="fixed inset-0 z-30 overflow-y-auto overscroll-contain
        bg-[radial-gradient(ellipse_at_center,rgba(7,3,26,0.35),rgba(7,3,26,0.88))]
        px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col justify-between gap-5 py-2">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center"
        >
          <Sparkles className="mx-auto h-6 w-6 text-fuchsia-300" />
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.3em] text-fuchsia-200/70">
            2 — 12 de octubre
          </p>
        </motion.div>

        <div className="space-y-3.5 sm:space-y-4">
          {NARRATIVE.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: FIRST_LINE_AT + index * LINE_DELAY, ease: "easeOut" }}
              className="text-balance text-center text-sm sm:text-base leading-relaxed text-white/85"
            >
              {line}
            </motion.p>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: CLOSER_AT, ease: "easeOut" }}
            className="text-balance text-center text-xl sm:text-2xl font-semibold leading-snug text-white pt-1"
          >
            {CLOSER}
            <span className="mt-1 block text-sm sm:text-base font-normal text-fuchsia-200/80">
              {CLOSER_SUB}
            </span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: BUTTON_AT, ease: "easeOut" }}
          className="space-y-2 pb-1"
        >
          <motion.button
            type="button"
            onClick={onStart}
            whileTap={{ scale: 0.96 }}
            animate={{
              boxShadow: [
                "0 0 26px rgba(236,72,153,0.35)",
                "0 0 52px rgba(236,72,153,0.65)",
                "0 0 26px rgba(236,72,153,0.35)",
              ],
            }}
            transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl
              bg-gradient-to-r from-rose-400 via-fuchsia-500 to-violet-500
              px-6 py-4 sm:py-4.5 text-base sm:text-lg font-semibold text-white shadow-lg"
          >
            <Rocket className="h-5 w-5" />
            Comenzar Viaje
          </motion.button>

          <p className="text-center text-[11px] text-white/40">
            Prepárate para el salto
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
