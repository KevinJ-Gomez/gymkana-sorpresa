"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

/**
 * Día 11 — plantilla base "gran final".
 * Sin contraseña: se desbloquea solo al entrar, lanza confeti con
 * canvas-confetti y pinta un muro de vídeos/placeholders de amigos.
 */
export function Day11({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const hasFiredConfetti = useRef(false);

  useEffect(() => {
    if (!isUnlocked) {
      onUnlock();
      return;
    }
    if (hasFiredConfetti.current) return;
    hasFiredConfetti.current = true;

    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ["#fb7185", "#f472b6", "#c084fc", "#fbbf24"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ["#fb7185", "#f472b6", "#c084fc", "#fbbf24"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
      colors: ["#fb7185", "#f472b6", "#c084fc", "#fbbf24"],
    });
  }, [isUnlocked, onUnlock]);

  if (!isUnlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-center"
    >
      <div>
        <h3 className="text-xl font-serif font-bold text-[#4a1d2e]">{config.rewardTitle}</h3>
        {config.rewardDescription && (
          <p className="mx-auto mt-2 max-w-md text-sm text-[#4a1d2e]/85 leading-relaxed">{config.rewardDescription}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {(config.friendVideos ?? []).map((friend, index) => (
          <FriendVideoCard key={friend.name} name={friend.name} videoSrc={friend.videoSrc} delay={index * 0.08} />
        ))}
      </div>
    </motion.div>
  );
}

function FriendVideoCard({
  name,
  videoSrc,
  delay,
}: {
  name: string;
  videoSrc?: string;
  delay: number;
}) {
  const [failed, setFailed] = useState(!videoSrc);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="overflow-hidden rounded-xl border border-petal-300/40 bg-white shadow-xs"
    >
      {!failed && videoSrc ? (
        <video controls src={videoSrc} onError={() => setFailed(true)} className="aspect-video w-full" />
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center gap-1 bg-[#faf0f4] text-[#9d5272]">
          <Video className="h-6 w-6" />
          <span className="text-xs font-serif italic">Vídeo pendiente</span>
        </div>
      )}
      <p className="border-t border-petal-200 py-1.5 text-xs font-medium text-[#4a1d2e]">{name}</p>
    </motion.div>
  );
}

export default Day11;
