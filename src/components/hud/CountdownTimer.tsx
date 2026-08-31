"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const TARGET_DATE = new Date("2026-10-12T00:00:00+02:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPassed: false };
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  if (timeLeft.isPassed) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-pink-400/30 bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-200 shadow-sm backdrop-blur-md">
        <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400 animate-pulse" />
        ¡Felices 30 Cumpleaños!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1 text-xs font-medium text-white/90 shadow-md backdrop-blur-md">
      <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
      <span className="text-[11px] text-pink-200/80">30 Cumpleaños:</span>
      <div className="flex items-center gap-1 font-mono font-semibold text-white">
        <span>{timeLeft.days}d</span>
        <span className="text-white/40">:</span>
        <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
        <span className="text-white/40">:</span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
        <span className="text-white/40">:</span>
        <span className="text-pink-300">{String(timeLeft.seconds).padStart(2, "0")}s</span>
      </div>
    </div>
  );
}

export default CountdownTimer;

