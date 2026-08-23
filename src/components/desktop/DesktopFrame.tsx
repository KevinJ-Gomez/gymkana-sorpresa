"use client";

import { useState } from "react";
import { Maximize2, RefreshCw, Smartphone } from "lucide-react";

/**
 * Vista de ESCRITORIO. Solo sirve para poder probar la gymkana desde el
 * ordenador: la app es y sigue siendo una experiencia de móvil en vertical.
 *
 * En vez de reimplementar (o "adaptar") nada, monta la app real dentro de un
 * iframe con el tamaño exacto de un móvil. Así lo que se ve en el ordenador es
 * literalmente la versión móvil, píxel por píxel, sin una sola rama de código
 * distinta: el viewport dentro del iframe mide 390x844 de verdad, así que las
 * media queries, `100dvh`, los safe-area insets y el 3D se comportan igual que
 * en un teléfono.
 *
 * El iframe carga `/?embed=1`; ese parámetro es lo que evita que la app vuelva
 * a detectar "escritorio" dentro del propio iframe y se anide infinitamente.
 */

const DEVICES = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "Pixel 7", width: 412, height: 915 },
] as const;

export function DesktopFrame() {
  const [deviceIndex, setDeviceIndex] = useState(1);
  // Cambiar la key remonta el iframe = recargar la app desde cero.
  const [reloadKey, setReloadKey] = useState(0);
  const device = DEVICES[deviceIndex];

  return (
    // El móvil ocupa el hueco que sobra (`flex-1` + `min-h-0`) en vez de tener
    // una altura calculada a ojo restando la cabecera. Con una constante fija
    // la cuenta no cuadraba y en ventanas bajas los controles se montaban
    // encima del móvil y el pie se salía de pantalla sin poder llegar a él.
    <div
      className="fixed inset-0 flex flex-col items-center gap-4 overflow-hidden p-6
        bg-[radial-gradient(ellipse_at_top,#1e1040,#0b0620_60%)]"
    >
      {/* Cabecera deliberadamente mínima: cada píxel que gasta el marco se lo
          quita al móvil simulado, y un móvil más bajo que uno real enseñaría
          problemas de layout que en un teléfono de verdad no existen. */}
      <header className="shrink-0 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs text-white/50">
          <Smartphone className="h-3.5 w-3.5" />
          Vista previa de escritorio · arrastra con el ratón como si fuera el dedo
        </p>
      </header>

      {/* Móvil simulado */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div
          className="relative rounded-[2.75rem] border border-white/15 bg-black p-3
            shadow-[0_25px_80px_rgba(139,92,246,0.25)]"
          // +24px = el padding del marco, para que el hueco interior tope
          // exactamente en la altura real del dispositivo elegido.
          style={{ height: "100%", maxHeight: device.height + 24 }}
        >
          {/* Muesca decorativa. `pointer-events-none` es importante: cae justo
              sobre el título de la app, que es el botón del gesto secreto de
              5 toques del Modo Testing, y si no lo bloquearía. */}
          <div
            className="pointer-events-none absolute left-1/2 top-3 z-10 h-6 w-32
              -translate-x-1/2 rounded-b-2xl bg-black"
          />
          <iframe
            key={`${device.name}-${reloadKey}`}
            src="/?embed=1"
            title="Gymkana (vista móvil)"
            allow="autoplay; fullscreen"
            className="block h-full rounded-[2rem] border-0 bg-[#0b0620]"
            style={{ width: device.width }}
          />
        </div>
      </div>

      {/* Controles */}
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
        {DEVICES.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setDeviceIndex(i)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              i === deviceIndex
                ? "bg-white/20 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {d.name} · {d.width}×{d.height}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2
            text-xs font-medium text-white/60 transition hover:bg-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reiniciar
        </button>

        {/* Pestaña nueva a propósito: hace falta una carga completa para que el
            shell relea `?embed=1`, y así el marco se queda abierto detrás. */}
        <button
          type="button"
          onClick={() => window.open("/?embed=1", "_blank", "noopener")}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2
            text-xs font-medium text-white/60 transition hover:bg-white/10"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Abrir a pantalla completa
        </button>
      </div>
    </div>
  );
}
