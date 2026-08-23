/** true si la fecha actual ya alcanzó `unlockDate` (formato "YYYY-MM-DD"). */
export function isDateReached(unlockDate: string): boolean {
  const target = new Date(`${unlockDate}T00:00:00`);
  return Date.now() >= target.getTime();
}

/** Formatea "YYYY-MM-DD" a algo legible en español, ej. "1 de septiembre". */
export function formatUnlockDate(unlockDate: string): string {
  const target = new Date(`${unlockDate}T00:00:00`);
  return target.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}
