"use client";

import { useCallback, useSyncExternalStore } from "react";

const UNLOCKED_DAYS_KEY = "gymkana:unlocked-days";
const TESTING_MODE_KEY = "gymkana:testing-mode";
const INTRO_SEEN_KEY = "gymkana:intro-seen";

// Pequeño store externo (patrón useSyncExternalStore) en vez de leer
// localStorage dentro de un useEffect + setState: evita el render en
// cascada de esa alternativa y mantiene referencias estables entre renders.
const listeners = new Set<() => void>();
function emitChange() {
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let unlockedDaysCache: number[] = [];
let unlockedDaysHydrated = false;

function readUnlockedDays(): number[] {
  if (!unlockedDaysHydrated) {
    try {
      const raw = window.localStorage.getItem(UNLOCKED_DAYS_KEY);
      unlockedDaysCache = raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      unlockedDaysCache = [];
    }
    unlockedDaysHydrated = true;
  }
  return unlockedDaysCache;
}

const EMPTY_UNLOCKED_DAYS: number[] = [];

function getUnlockedDaysServerSnapshot(): number[] {
  return EMPTY_UNLOCKED_DAYS;
}

/**
 * Persiste en localStorage qué días ha resuelto ya el usuario, para que un
 * refresco de página no le obligue a repetir acertijos ya superados.
 */
export function useUnlockedDays() {
  const unlockedDays = useSyncExternalStore(
    subscribe,
    readUnlockedDays,
    getUnlockedDaysServerSnapshot,
  );

  const markUnlocked = useCallback((dayId: number) => {
    const current = readUnlockedDays();
    if (current.includes(dayId)) return;
    unlockedDaysCache = [...current, dayId];
    unlockedDaysHydrated = true;
    window.localStorage.setItem(UNLOCKED_DAYS_KEY, JSON.stringify(unlockedDaysCache));
    emitChange();
  }, []);

  const relockDay = useCallback((dayId: number) => {
    const current = readUnlockedDays();
    unlockedDaysCache = current.filter((id) => id !== dayId);
    unlockedDaysHydrated = true;
    window.localStorage.setItem(UNLOCKED_DAYS_KEY, JSON.stringify(unlockedDaysCache));
    emitChange();
  }, []);

  const resetUnlockedDays = useCallback(() => {
    unlockedDaysCache = [];
    unlockedDaysHydrated = true;
    window.localStorage.removeItem(UNLOCKED_DAYS_KEY);
    emitChange();
  }, []);

  return { unlockedDays, markUnlocked, relockDay, resetUnlockedDays };
}

function readTestingMode(defaultValue: boolean): boolean {
  const stored = window.localStorage.getItem(TESTING_MODE_KEY);
  return stored === null ? defaultValue : stored === "true";
}

/** Persiste el "Modo Testing" (bypass de fechas) entre recargas. */
export function useTestingMode(defaultValue: boolean) {
  const testingMode = useSyncExternalStore(
    subscribe,
    () => readTestingMode(defaultValue),
    () => defaultValue,
  );

  const setTestingMode = useCallback((value: boolean) => {
    window.localStorage.setItem(TESTING_MODE_KEY, String(value));
    emitChange();
  }, []);

  return { testingMode, setTestingMode };
}

function readIntroSeen(): boolean {
  return window.localStorage.getItem(INTRO_SEEN_KEY) === "true";
}

/**
 * La cinemática de intro se ve una sola vez por dispositivo: después de
 * completarla se entra directo a la nebulosa en cada recarga.
 * El snapshot de servidor devuelve `false` para que el primer render (y el
 * HTML estático) sea siempre la intro y no haya salto al hidratar.
 */
export function useIntroSeen() {
  const introSeen = useSyncExternalStore(
    subscribe,
    readIntroSeen,
    () => false,
  );

  const setIntroSeen = useCallback((value: boolean) => {
    window.localStorage.setItem(INTRO_SEEN_KEY, String(value));
    emitChange();
  }, []);

  return { introSeen, setIntroSeen };
}
