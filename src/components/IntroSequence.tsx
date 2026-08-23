"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/** Líneas narrativas de la intro. Se revelan escalonadas, no requiere tocar nada. */
const NARRATIVE = [
  "El 2 de octubre acaba de empezar nuestro viaje.",
  "Pero hay un problema: tus regalos no cabían en la maleta.",
  "Así que se han quedado en casa, esperándote.",
  "Para descubrir qué te espera a la vuelta, tendrás que ganártelo:",
  "once días, once estrellas y un acertijo en cada una.",
];

/** Retardo (s) en el que aparece cada línea. */
const LINE_DELAY = 0.7;
const FIRST_LINE_AT = 1.1;
const BUTTON_AT = FIRST_LINE_AT + NARRATIVE.length * LINE_DELAY + 0.4;

export function IntroSequence({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-30 flex flex-col justify-between
        bg-[radial-gradient(ellipse_at_center,rgba(11,6,32,0.55),rgba(11,6,32,0.92))]
        px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]"
    >
      {/* Cabecera */}
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

      {/* Narrativa */}
      <div className="space-y-5">
        {NARRATIVE.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 1,
              delay: FIRST_LINE_AT + index * LINE_DELAY,
              ease: "easeOut",
            }}
            className={
              index === NARRATIVE.length - 1
                ? "text-balance text-center text-2xl font-semibold leading-snug text-white"
                : "text-balance text-center text-lg leading-relaxed text-white/80"
            }
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Llamada a la acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: BUTTON_AT, ease: "easeOut" }}
        className="space-y-4"
      >
        <motion.button
          type="button"
          onClick={onStart}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              "0 0 26px rgba(236,72,153,0.35)",
              "0 0 46px rgba(236,72,153,0.6)",
              "0 0 26px rgba(236,72,153,0.35)",
            ],
          }}
          transition={{ boxShadow: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } }}
          className="w-full rounded-2xl bg-gradient-to-r from-rose-400 via-fuchsia-500 to-violet-500
            px-6 py-5 text-lg font-semibold text-white"
        >
          Comenzar Viaje
        </motion.button>

        <p className="text-center text-xs text-white/40">
          Desliza para explorar la nebulosa · Toca una estrella para abrirla
        </p>
      </motion.div>
    </motion.div>
  );
}
