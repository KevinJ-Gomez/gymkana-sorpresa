"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Smile } from "lucide-react";
import { hapticSuccess } from "@/lib/haptics";

interface GiftUnboxModalProps {
  isOpen: boolean;
  onOpened: () => void;
  giftTitle?: string;
}

export function GiftUnboxModal({ isOpen, onOpened, giftTitle }: GiftUnboxModalProps) {
  return (
    <AnimatePresence>
      {isOpen && <GiftUnboxContent key="gift" onOpened={onOpened} giftTitle={giftTitle} />}
    </AnimatePresence>
  );
}

function GiftUnboxContent({ onOpened, giftTitle }: Omit<GiftUnboxModalProps, "isOpen">) {
  const [opened, setOpened] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; scale: number; rot: number }[]
  >([]);

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (openTimer.current !== null) clearTimeout(openTimer.current);
    };
  }, []);

  function handleOpenBox() {
    if (opened) return;
    setOpened(true);
    hapticSuccess();

    // Generar partículas de corazones y chispas festivas
    const colors = ["#d9b19d", "#a66056", "#c5a56d", "#a5b5a5", "#e5c8b9", "#f3eee4"];
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

    openTimer.current = setTimeout(() => {
      onOpened();
    }, 1600);
  }

  return (
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
            <Heart className="h-5 w-5 fill-current" style={{ color: p.color }} />
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
            className="absolute -inset-8 rounded-full bg-gradient-to-r from-petal-500/30 via-petal-500/30 to-petal-500/30 blur-2xl"
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
            <div className="flex h-16 w-36 items-center justify-center rounded-2xl bg-gradient-to-b from-petal-500 to-petal-600 shadow-xl border-t border-petal-300">
              <div className="absolute -top-4 flex items-center justify-center">
                <Heart className="h-7 w-7 text-petal-200 fill-petal-300 drop-shadow" />
              </div>
              <div className="h-full w-5 bg-petal-300 border-x border-petal-200" />
            </div>
          </motion.div>

          {/* Cuerpo de la caja */}
          <motion.div
            animate={opened ? { scale: [1, 1.15, 0.9, 0], opacity: [1, 1, 0] } : {}}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative -mt-2 flex h-28 w-32 items-center justify-center rounded-2xl bg-gradient-to-b from-petal-600 to-petal-700 shadow-2xl border border-petal-400"
          >
            <div className="h-full w-5 bg-petal-300 border-x border-petal-200" />
            <div className="absolute inset-x-0 h-5 bg-petal-300 border-y border-petal-200" />
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
            <Smile className="h-6 w-6 text-petal-300" />
            {opened ? "¡Estrella Encendida!" : "¡Has resuelto el reto!"}
          </h3>
          <p className="text-sm text-petal-200/80">
            {opened ? "¡Tu estrella ya brilla en la constelación!" : "Toca para abrir tu sorpresa y encender la estrella"}
          </p>
          {giftTitle && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-petal-400/40 bg-petal-400/15 px-4 py-1 text-xs font-semibold text-petal-300">
              <Heart className="h-3.5 w-3.5 fill-petal-400 text-petal-400" />
              {giftTitle}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GiftUnboxModal;

