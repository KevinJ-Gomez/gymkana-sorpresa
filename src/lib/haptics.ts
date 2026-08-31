/**
 * Utilidad segura de respuesta háptica por vibración táctil para móviles.
 * Comprueba si la Vibration API está soportada en el navegador.
 */

export function triggerHaptic(pattern: number | number[] = 15): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  try {
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silencioso si el navegador o el dispositivo no lo permite
  }
}

/** Toque suave (12ms) para botones o selección de estrellas */
export function hapticTap(): void {
  triggerHaptic(12);
}

/** Doble pulso festivo y satisfactorio para aciertos y desbloqueos */
export function hapticSuccess(): void {
  triggerHaptic([30, 45, 50, 40, 80]);
}

/** Micro-vibración rápida para cuando se rasca la tarjeta */
export function hapticScratch(): void {
  triggerHaptic(8);
}

/** Vibración de advertencia/error ante una clave incorrecta */
export function hapticError(): void {
  triggerHaptic([60, 80, 60]);
}
