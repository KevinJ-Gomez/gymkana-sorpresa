"use client";

import { useEffect, useRef } from "react";

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
}

const COLORS = [
  "#fde047", // Oro brillante
  "#fbbf24", // Ámbar cálido
  "#f472b6", // Rosa mágico
  "#e879f9", // Fucsia estelar
  "#67e8f9", // Cian celeste
  "#ffffff", // Blanco puro
];

export function TouchParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: SparkParticle[] = [];
    let isMoving = false;
    let lastMoveTime = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function createSpark(x: number, y: number) {
      const count = Math.random() < 0.6 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.8;
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3, // Leve flotación hacia arriba
          size: 2.0 + Math.random() * 3.2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 0.95,
          decay: 0.02 + Math.random() * 0.03,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.2,
        });
      }
    }

    function onPointerMove(e: PointerEvent) {
      createSpark(e.clientX, e.clientY);
      lastMoveTime = Date.now();
      if (!isMoving) {
        isMoving = true;
        loop();
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        createSpark(touch.clientX, touch.clientY);
        lastMoveTime = Date.now();
        if (!isMoving) {
          isMoving = true;
          loop();
        }
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      // Estrella de 4 puntas estilizada
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -size);
        ctx.lineTo(size * 0.25, -size * 0.25);
        ctx.rotate(Math.PI / 2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;
        p.size = Math.max(0, p.size - 0.03);

        if (p.alpha <= 0 || p.size <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        drawStar(ctx, p.x, p.y, p.size, p.rotation);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (particles.length > 0) {
        animId = requestAnimationFrame(loop);
      } else if (Date.now() - lastMoveTime > 300) {
        isMoving = false;
      } else {
        animId = requestAnimationFrame(loop);
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  );
}

export default TouchParticleTrail;
