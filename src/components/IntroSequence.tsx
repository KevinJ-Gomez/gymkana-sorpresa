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
      className="fixed inset-0 z-30 flex flex-col justify-center overflow-y-auto overscroll-contain bg-[#15061c]/85 backdrop-blur-md px-4 sm:px-6 py-[max(1.5rem,env(safe-area-inset-top))]"
    >
      <div className="invitation-paper relative my-auto w-full max-w-md mx-auto rounded-2xl p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center"
        >
          <div className="invitation-dateline mb-4" aria-hidden="true">
            <span>02 OCT</span>
            <span>—</span>
            <span>12 OCT</span>
          </div>
          <div className="flex items-center justify-center mb-2">
            <span className="letter-seal !static inline-grid place-items-center">XI</span>
          </div>
          <p className="mt-2 text-xs font-serif uppercase tracking-[0.25em] text-[#9d5272]">
            El comienzo de nuestra aventura
          </p>
          <div className="invitation-rule" aria-hidden="true" />
        </motion.div>

        <div className="intro-narrative space-y-4 text-center">
          {NARRATIVE.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: FIRST_LINE_AT + index * LINE_DELAY, ease: "easeOut" }}
              className="font-serif text-sm sm:text-base leading-relaxed text-[#4a1d2e]"
            >
              {line}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: CLOSER_AT, ease: "easeOut" }}
            className="pt-4 border-t border-[#f4c2d4]/70"
          >
            <p className="font-serif text-xl sm:text-2xl font-bold leading-snug text-[#9d174d]">
              {CLOSER}
            </p>
            <span className="mt-1 block font-serif italic text-xs sm:text-sm text-[#9f496e]">
              {CLOSER_SUB}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: BUTTON_AT, ease: "easeOut" }}
          className="mt-6 space-y-2.5"
        >
          <motion.button
            type="button"
            onClick={onStart}
            whileTap={{ scale: 0.96 }}
            className="primary-action flex w-full items-center justify-center gap-2 rounded-full
              px-6 py-4 text-base font-serif font-bold text-white shadow-lg tracking-wide"
          >
            Comenzar Viaje 💌
          </motion.button>

          <p className="text-center text-[11px] font-serif italic text-[#9f496e]">
            Prepárate para el viaje estelar
          </p>
        </motion.div>

        <div className="invitation-endmark" aria-hidden="true">· &nbsp; · &nbsp; ·</div>
      </div>
    </motion.div>
  );
}
