"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

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
      className="fixed inset-0 z-30 flex flex-col justify-between
        bg-[radial-gradient(ellipse_at_center,rgba(7,3,26,0.35),rgba(7,3,26,0.88))]
        px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]"
    >
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-center"
      >
        <Sparkles className="mx-auto h-7 w-7 text-fuchsia-300" />
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-fuchsia-200/70">
          2 — 12 de octubre
        </p>
      </motion.div>

      <div className="space-y-5">
        {NARRATIVE.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: FIRST_LINE_AT + index * LINE_DELAY, ease: "easeOut" }}
            className="text-balance text-center text-lg leading-relaxed text-white/80"
          >
            {line}
          </motion.p>
        ))}

        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: CLOSER_AT, ease: "easeOut" }}
          className="text-balance text-center text-2xl font-semibold leading-snug text-white"
        >
          {CLOSER}
          <span className="mt-1.5 block text-base font-normal text-fuchsia-200/80">
            {CLOSER_SUB}
          </span>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: BUTTON_AT, ease: "easeOut" }}
        className="space-y-4"
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
            px-6 py-5 text-lg font-semibold text-white"
        >
          <Heart className="h-5 w-5 fill-current" />
          Comenzar Viaje
        </motion.button>

        <p className="text-center text-xs text-white/40">
          Prepárate para el salto
        </p>
      </motion.div>
    </motion.div>
  );
}
