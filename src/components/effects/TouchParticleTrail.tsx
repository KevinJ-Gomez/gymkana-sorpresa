"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
}

export function TouchParticleTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      addParticle(touch.clientX, touch.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.buttons > 0) {
        addParticle(e.clientX, e.clientY);
      }
    };

    const colors = ["#f43f5e", "#ec4899", "#fb7185", "#f472b6", "#fda4af"];

    function addParticle(x: number, y: number) {
      const newParticle: Particle = {
        id: idCounter.current++,
        x,
        y,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.9,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 1,
      };

      setParticles((prev) => [...prev.slice(-25), newParticle]);
    }

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.04,
            size: Math.max(0, p.size - 0.3),
          }))
          .filter((p) => p.opacity > 0.05 && p.size > 1),
      );
    }, 25);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[0.5px]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

export default TouchParticleTrail;

