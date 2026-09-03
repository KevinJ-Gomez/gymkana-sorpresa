"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { DayConfig } from "@/types/gymkana";
import { formatUnlockDate } from "@/lib/dates";
import { hapticTap } from "@/lib/haptics";

interface DailyPlanDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  days: DayConfig[];
  unlockedDays: number[];
  activeDayId: number;
}

// Estructura de días de Octubre 2026
// Octubre 2026 empieza en Jueves (1 de octubre).
// Lunes=0, Martes=1, Miércoles=2, Jueves=3, Viernes=4, Sábado=5, Domingo=6.
interface CalendarCell {
  dayOfMonth: number;
  gymkanaDayId?: number; // 1 a 11 si corresponde al viaje (2 al 12 de octubre)
}

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

function getCalendarWeeks(): (CalendarCell | null)[][] {
  // 1 de octubre = Jueves (índice 3). Los 3 primeros días de la primera semana están vacíos.
  const allDays: (CalendarCell | null)[] = [
    null, // Lun
    null, // Mar
    null, // Mié
  ];

  // Del 1 al 18 de octubre (cubre todos los días del viaje 2..12)
  for (let dayNum = 1; dayNum <= 18; dayNum++) {
    const gymkanaId = dayNum >= 2 && dayNum <= 12 ? dayNum - 1 : undefined;
    allDays.push({
      dayOfMonth: dayNum,
      gymkanaDayId: gymkanaId,
    });
  }

  // Rellenar hasta completar la fila de la última semana (múltiplo de 7)
  while (allDays.length % 7 !== 0) {
    allDays.push(null);
  }

  // Dividir en semanas de 7 días
  const weeks: (CalendarCell | null)[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  return weeks;
}

export function DailyPlanDrawer({
  isOpen,
  onToggle,
  onClose,
  days,
  unlockedDays,
  activeDayId,
}: DailyPlanDrawerProps) {
  // Inicializamos el día seleccionado en el día activo resuelto
  const [selectedDayId, setSelectedDayId] = useState<number>(activeDayId);

  // Sincronizar si cambia el día activo
  useEffect(() => {
    setSelectedDayId(activeDayId);
  }, [activeDayId]);

  const selectedDay = useMemo(() => {
    return days.find((d) => d.id === selectedDayId) ?? days.find((d) => d.id === activeDayId) ?? days[0];
  }, [days, selectedDayId, activeDayId]);

  const weeks = useMemo(() => getCalendarWeeks(), []);

  // Comprobar si el día seleccionado ha sido resuelto
  const isSelectedDayUnlocked = unlockedDays.includes(selectedDay.id);

  // Nota del plan para el día seleccionado
  const dayNote =
    selectedDay.dailyPlanNote ||
    selectedDay.dailyPlan?.note ||
    selectedDay.dailyPlan?.summary ||
    "";

  const handleSelectGymkanaDay = (gymkanaId?: number) => {
    if (!gymkanaId) return;
    hapticTap();
    setSelectedDayId(gymkanaId);
  };

  return (
    <motion.div
      initial={false}
      animate={{ y: isOpen ? "12%" : "calc(100% - 60px)" }}
      transition={{ type: "spring", damping: 32, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.15, bottom: 0.35 }}
      onDragEnd={(_, info) => {
        if (!isOpen && (info.offset.y < -40 || info.velocity.y < -300)) {
          hapticTap();
          onToggle();
        } else if (isOpen && (info.offset.y > 50 || info.velocity.y > 300)) {
          hapticTap();
          onClose();
        }
      }}
      className="fixed inset-x-0 bottom-0 z-30 flex h-[88dvh] flex-col rounded-t-[2rem]
        border-t border-white/15 bg-slate-950/95 shadow-[0_-12px_45px_rgba(0,0,0,0.9)]
        backdrop-blur-2xl select-none"
    >
      {/* ================= TIRADOR / PESTAÑA INFERIOR ================= */}
      <div
        onClick={() => {
          hapticTap();
          onToggle();
        }}
        className="flex w-full shrink-0 cursor-pointer flex-col items-center pt-2.5 pb-2.5"
      >
        <div className="h-1.5 w-12 rounded-full bg-white/30" />
        {!isOpen && (
          <p className="mt-1.5 text-xs font-medium tracking-wide text-white/80">
            Desliza hacia arriba para ver el planning del día
          </p>
        )}
      </div>

      {/* ================= CABECERA EXPANDIDA ================= */}
      {isOpen && (
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 pt-1 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              Planning del día
            </h3>
            <p className="text-[11px] font-mono text-white/50">
              Calendario de Octubre 2026
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              hapticTap();
              onClose();
            }}
            className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-white transition hover:bg-white/20 active:scale-95"
          >
            Cerrar
          </button>
        </header>
      )}

      {/* ================= CONTENIDO DEL DRAWER (CALENDARIO Y NOTAS) ================= */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-24">
        {/* VISTA CALENDARIO */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/75">
              Octubre 2026
            </span>
            <span className="text-[11px] font-mono text-white/40">
              Día {activeDayId} activo
            </span>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
            {WEEKDAYS.map((wDay) => (
              <span
                key={wDay}
                className="text-[11px] font-semibold text-white/40 uppercase"
              >
                {wDay}
              </span>
            ))}
          </div>

          {/* Matriz de semanas */}
          <div className="space-y-1.5">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 gap-1.5">
                {week.map((cell, cIdx) => {
                  if (!cell) {
                    return <div key={cIdx} className="h-11 w-full" />;
                  }

                  const gymkanaId = cell.gymkanaDayId;
                  const isTripDay = gymkanaId !== undefined;
                  const isDayUnlocked = isTripDay && unlockedDays.includes(gymkanaId);
                  const isDayActive = gymkanaId === activeDayId;
                  const isDaySelected = gymkanaId === selectedDayId;

                  // Si es un día del viaje pero NO ha sido resuelto su acertijo, no se ve
                  if (isTripDay && !isDayUnlocked) {
                    const isSelectedLocked = isDaySelected;
                    return (
                      <div
                        key={cIdx}
                        onClick={() => handleSelectGymkanaDay(gymkanaId)}
                        className={`relative flex flex-col items-center justify-center rounded-xl h-11 transition-all cursor-pointer ${
                          isSelectedLocked
                            ? "border border-rose-400/50 bg-rose-950/20 text-white/30"
                            : "border border-white/5 bg-white/[0.02] text-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <span className="text-xs font-mono">—</span>
                      </div>
                    );
                  }

                  // Día resuelto o día fuera del viaje
                  let cellClasses = "relative flex flex-col items-center justify-center rounded-xl h-11 transition-all ";

                  if (!isTripDay) {
                    // Día fuera de la gymkana
                    cellClasses += "bg-transparent text-white/20";
                  } else if (isDayActive && isDaySelected) {
                    // Día actual activo Y seleccionado
                    cellClasses += "border border-cyan-400 bg-cyan-500/25 text-white font-bold shadow-[0_0_15px_rgba(0,191,255,0.35)] cursor-pointer";
                  } else if (isDayActive) {
                    // Día actual activo
                    cellClasses += "border border-cyan-400/80 bg-cyan-500/15 text-white font-bold cursor-pointer";
                  } else if (isDaySelected) {
                    // Día seleccionado resuelto
                    cellClasses += "border border-white/80 bg-white/20 text-white font-semibold cursor-pointer";
                  } else {
                    // Día resuelto
                    cellClasses += "border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 cursor-pointer";
                  }

                  return (
                    <div
                      key={cIdx}
                      onClick={() => handleSelectGymkanaDay(gymkanaId)}
                      className={cellClasses}
                    >
                      <span className="text-xs">{cell.dayOfMonth}</span>
                      {isTripDay && (
                        <span className="text-[9px] font-mono leading-none text-white/60 mt-0.5">
                          D{gymkanaId}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ESPACIO PARA LA NOTA DEL DÍA */}
        {isSelectedDayUnlocked ? (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">
                  {selectedDay.id === activeDayId ? "Día de hoy" : `Día ${selectedDay.id}`} · {formatUnlockDate(selectedDay.unlockDate)}
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white">
                  {selectedDay.title}
                </h4>
              </div>

              {selectedDay.id === activeDayId && (
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                  Hoy
                </span>
              )}
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block mb-1.5">
                Plan previsto
              </span>

              {dayNote ? (
                <p className="font-serif text-sm sm:text-base text-white/95 leading-relaxed whitespace-pre-line">
                  {dayNote}
                </p>
              ) : (
                <p className="text-xs sm:text-sm italic text-white/40 leading-relaxed">
                  No hay ningún plan anotado todavía para este día.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-sm font-medium text-white/80 leading-relaxed">
              ¡No puedes ver este día hasta que resuelvas el acertijo del día correspondiente!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DailyPlanDrawer;
