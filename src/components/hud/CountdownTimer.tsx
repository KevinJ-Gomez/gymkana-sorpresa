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
    const initialTick = setTimeout(() => setTimeLeft(calculateTimeLeft()), 0);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(initialTick);
      clearInterval(interval);
    };
  }, []);

  if (!timeLeft) return null;

  if (timeLeft.isPassed) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-petal-400/40 bg-[#fff8fa] px-3.5 py-1.5 text-xs font-semibold text-[#be185d] shadow-[inset_0_0_0_2px_#faf0f4,0_4px_12px_rgba(0,0,0,0.25)]">
        <Heart className="h-3.5 w-3.5 fill-[#be185d] text-[#be185d] animate-pulse" />
        <span className="font-serif tracking-wide">¡Felices 30 Cumpleaños!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-[#f472b6]/40 bg-[#fff8fa]/95 px-4 py-1.5 text-xs font-medium text-[#4a1d2e] shadow-[inset_0_0_0_2px_#faf0f4,0_6px_20px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <Heart className="h-3.5 w-3.5 fill-[#be185d] text-[#be185d]" />
      <span className="text-[11px] font-serif uppercase tracking-wider text-[#9d5272]">30 Cumpleaños:</span>
      <div className="flex items-center gap-1.5 font-serif font-semibold text-[#be185d]">
        <span>{timeLeft.days}d</span>
        <span className="text-[#e895b2] font-normal">:</span>
        <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
        <span className="text-[#e895b2] font-normal">:</span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
        <span className="text-[#e895b2] font-normal">:</span>
        <span className="text-[#be185d] font-bold">{String(timeLeft.seconds).padStart(2, "0")}s</span>
      </div>
    </div>
  );
}

export default CountdownTimer;

