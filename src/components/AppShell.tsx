"use client";

import { useSyncExternalStore } from "react";
import { GymkanaApp } from "@/components/GymkanaApp";
import { DesktopFrame } from "@/components/desktop/DesktopFrame";

/**
 * Decide qué se pinta: la app tal cual (móvil) o el marco de escritorio.
 *
 * La rama móvil devuelve EXACTAMENTE lo mismo que antes (`<GymkanaApp />`), y
 * el snapshot de servidor es siempre "app", así que en móvil el HTML servido y
 * la hidratación no cambian ni un byte respecto a antes de existir este shell.
 */

const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)";

type Mode = "app" | "desktop";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): Mode {
  // Dentro del iframe del marco de escritorio se fuerza la app directamente:
  // sin esto, la vista de escritorio se anidaría dentro de sí misma.
  if (new URLSearchParams(window.location.search).has("embed")) return "app";
  return window.matchMedia(DESKTOP_QUERY).matches ? "desktop" : "app";
}

function getServerSnapshot(): Mode {
  return "app";
}

export function AppShell() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return mode === "desktop" ? <DesktopFrame /> : <GymkanaApp />;
}
