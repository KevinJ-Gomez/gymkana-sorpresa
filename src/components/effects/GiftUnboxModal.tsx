"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Smile } from "lucide-react";
import { hapticSuccess } from "@/lib/haptics";

interface GiftUnboxModalProps {
  isOpen: boolean;
  onOpened: () => void;
  giftTitle?: string;
}

export function GiftUnboxModal({ isOpen, onOpened, giftTitle }: GiftUnboxModalProps) {
  const [opened, setOpened] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; scale: number; rot: number }[]
  >([]);

  useEffect(() => {
    if (!isOpen) {
      setOpened(false);
      setParticles([]);
    }
  }, [isOpen]);

  function handleOpenBox() {
    if (opened) return;
    setOpened(true);
    hapticSuccess();

    // Generar partículas de corazones y chispas festivas
    const colors = ["#f43f5e", "#ec4899", "#fbbf24", "#a855f7", "#38bdf8", "#ffffff"];
    const pts = Array.from({ length: 45 }, (_, i) => {
      const angle = (i / 45) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 90 + Math.random() * 160;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.6 + Math.random() * 0.9,
        rot: (Math.random() - 0.5) * 360,
      };
    });
    setParticles(pts);

    setTimeout(() => {
      onOpened();
    }, 1600);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-xl"
        >
          <div className="relative flex flex-col items-center text-center">
            {/* Corazones y destellos que estallan */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.2, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [1, 1, 0],
                  scale: [0.2, p.scale, 0.4],
                  rotate: p.rot,
                }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="pointer-events-none absolute z-20 flex items-center justify-center"
              >
                {p.id % 2 === 0 ? (
                  <Heart className="h-5 w-5 fill-current" style={{ color: p.color }} />
                ) : (
                  <Sparkles className="h-4 w-4" style={{ color: p.color }} />
                )}
              </motion.div>
            ))}

            {/* Caja de Regalo Interactiva con Corazones */}
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={handleOpenBox}
              className="relative cursor-pointer select-none"
            >
              {/* Resplandor pulsante */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-8 rounded-full bg-gradient-to-r from-rose-500/30 via-fuchsia-500/30 to-pink-500/30 blur-2xl"
              />

              {/* Tapa de la caja */}
              <motion.div
                animate={
                  opened
                    ? { y: -85, rotate: -25, opacity: 0 }
                    : { y: [0, -5, 0] }
                }
                transition={
                  opened
                    ? { duration: 0.7, ease: "easeOut" }
                    : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
                className="relative z-10 flex items-center justify-center"
              >
                <div className="flex h-16 w-36 items-center justify-center rounded-2xl bg-gradient-to-b from-rose-500 to-rose-600 shadow-xl border-t border-rose-300">
                  <div className="absolute -top-4 flex items-center justify-center">
                    <Heart className="h-7 w-7 text-pink-200 fill-pink-300 drop-shadow" />
                  </div>
                  <div className="h-full w-5 bg-pink-300 border-x border-pink-200" />
                </div>
              </motion.div>

              {/* Cuerpo de la caja */}
              <motion.div
                animate={opened ? { scale: [1, 1.15, 0.9, 0], opacity: [1, 1, 0] } : {}}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="relative -mt-2 flex h-28 w-32 items-center justify-center rounded-2xl bg-gradient-to-b from-rose-600 to-rose-700 shadow-2xl border border-rose-400"
              >
                <div className="h-full w-5 bg-pink-300 border-x border-pink-200" />
                <div className="absolute inset-x-0 h-5 bg-pink-300 border-y border-pink-200" />
              </motion.div>
            </motion.div>

            {/* Textos descriptivos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 space-y-2"
            >
              <h3 className="text-2xl font-bold text-white drop-shadow flex items-center justify-center gap-2">
                <Smile className="h-6 w-6 text-pink-300" />
                {opened ? "¡Sorpresa Desbloqueada!" : "¡Has resuelto el reto!"}
              </h3>
              <p className="text-sm text-fuchsia-200/80">
                {opened ? "Revelando tu recompensa..." : "Toca para abrir tu sorpresa"}
              </p>
              {giftTitle && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/40 bg-pink-400/15 px-4 py-1 text-xs font-semibold text-pink-300">
                  <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
                  {giftTitle}
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GiftUnboxModal;
