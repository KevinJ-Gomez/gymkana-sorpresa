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

/** Formatea "YYYY-MM-DD" con el día de la semana, ej. "Viernes, 2 de octubre". */
export function formatWeekdayAndDate(unlockDate: string): string {
  const target = new Date(`${unlockDate}T00:00:00`);
  const formatted = target.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
