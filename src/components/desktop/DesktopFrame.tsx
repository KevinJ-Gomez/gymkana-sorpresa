"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, RefreshCw, Smartphone } from "lucide-react";

/**
 * Vista de ESCRITORIO. Solo sirve para poder probar la gymkana desde el
 * ordenador: la app es y sigue siendo una experiencia de móvil en vertical.
 *
 * Monta la app dentro de un iframe con las dimensiones nativas exactas del
 * dispositivo seleccionado (ej. iPhone 14 = 390x844).
 * Si la ventana del navegador en PC tiene menos altura disponible, el marco
 * se escala de forma suave y proporcional mediante CSS scale para preservar
 * siempre la esbeltez, longitud y aspecto vertical real de un teléfono móvil,
 * sin achatarse jamás ni comprimir los textos.
 */

const DEVICES = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "Pixel 7", width: 412, height: 915 },
] as const;

export function DesktopFrame() {
  const [deviceIndex, setDeviceIndex] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const device = DEVICES[deviceIndex];

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const frameW = device.width + 24; // 12px padding por lado
      const frameH = device.height + 24; // 12px padding por lado
      const availableW = Math.max(100, clientWidth - 20);
      const availableH = Math.max(100, clientHeight - 20);
      const fitScale = Math.min(1, Math.min(availableW / frameW, availableH / frameH));
      setScale(Math.max(0.35, Number(fitScale.toFixed(3))));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [device]);

  const frameWidth = device.width + 24;
  const frameHeight = device.height + 24;

  return (
    <div
      className="desktop-studio fixed inset-0 flex flex-col items-center gap-2 overflow-hidden p-2 sm:p-3
        bg-[radial-gradient(ellipse_at_top,#1e1040,#141919_60%)] select-none"
    >
      {/* Cabecera sutil */}
      <header className="shrink-0 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs text-white/60">
          <Smartphone className="h-3.5 w-3.5 text-petal-300" />
          Vista previa móvil de escritorio · proporción real {device.width}×{device.height}
          {scale < 1 && (
            <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-petal-200">
              {Math.round(scale * 100)}%
            </span>
          )}
        </p>
      </header>

      {/* Móvil simulado con escalado proporcional que preserva esbeltez y altura real */}
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 items-center justify-center w-full overflow-hidden"
      >
        <div
          style={{
            width: frameWidth * scale,
            height: frameHeight * scale,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="device-frame relative rounded-[2.75rem] border border-white/20 bg-black p-3
              shadow-[0_25px_80px_rgba(139,92,246,0.25)]"
            style={{
              width: frameWidth,
              height: frameHeight,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out",
            }}
          >
            {/* Ranura sutil de altavoz en el marco */}
            <div
              className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-1 w-12
                -translate-x-1/2 rounded-full bg-white/20"
            />
            <iframe
              key={`${device.name}-${reloadKey}`}
              src="/?embed=1"
              title="Gymkana (vista móvil)"
              allow="autoplay; fullscreen"
              className="block rounded-[2.25rem] border-0 bg-[#15061c]"
              style={{ width: device.width, height: device.height }}
            />
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
        {DEVICES.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setDeviceIndex(i)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              i === deviceIndex
                ? "bg-petal-600 text-white shadow-sm"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {d.name} · {d.width}×{d.height}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5
            text-xs font-medium text-white/60 transition hover:bg-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reiniciar
        </button>

        <button
          type="button"
          onClick={() => window.open("/?embed=1", "_blank", "noopener")}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5
            text-xs font-medium text-white/60 transition hover:bg-white/10"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Abrir a pantalla completa
        </button>
      </div>
    </div>
  );
}
