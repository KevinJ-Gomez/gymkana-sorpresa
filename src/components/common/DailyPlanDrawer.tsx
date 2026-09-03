"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  MapPin,
  Clock,
  Lock,
  CheckCircle2,
  ChevronUp,
  X,
  Utensils,
  Car,
  Coffee,
  Heart,
  Sparkles,
  Shirt,
  Calendar,
} from "lucide-react";
import type { DayConfig, TimelineEvent } from "@/types/gymkana";
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

// Icono semántico según el tipo de actividad
function EventTypeIcon({ type }: { type?: TimelineEvent["type"] }) {
  switch (type) {
    case "food":
      return <Utensils className="h-3.5 w-3.5 text-amber-300" />;
    case "transport":
      return <Car className="h-3.5 w-3.5 text-sky-300" />;
    case "relax":
      return <Coffee className="h-3.5 w-3.5 text-emerald-300" />;
    case "party":
      return <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />;
    case "mystery":
      return <Heart className="h-3.5 w-3.5 text-rose-300 fill-rose-300/40" />;
    default:
      return <Compass className="h-3.5 w-3.5 text-cyan-300" />;
  }
}

export function DailyPlanDrawer({
  isOpen,
  onToggle,
  onClose,
  days,
  unlockedDays,
  activeDayId,
}: DailyPlanDrawerProps) {
  const activeDay = useMemo(
    () => days.find((d) => d.id === activeDayId) ?? days[0],
    [days, activeDayId],
  );

  return (
    <motion.div
      initial={false}
      animate={{ y: isOpen ? "14%" : "calc(100% - 62px)" }}
      transition={{ type: "spring", damping: 30, stiffness: 280 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.15, bottom: 0.4 }}
      onDragEnd={(_, info) => {
        if (!isOpen && (info.offset.y < -40 || info.velocity.y < -300)) {
          hapticTap();
          onToggle();
        } else if (isOpen && (info.offset.y > 60 || info.velocity.y > 350)) {
          hapticTap();
          onClose();
        }
      }}
      className="fixed inset-x-0 bottom-0 z-30 flex h-[88dvh] flex-col rounded-t-[2.2rem]
        border-t border-white/15 bg-slate-950/90 shadow-[0_-12px_45px_rgba(0,0,0,0.85)]
        backdrop-blur-2xl"
    >
      {/* ================= PESTAÑA / TIRADOR DE ARRASTRE ================= */}
      <div
        onClick={() => {
          hapticTap();
          onToggle();
        }}
        className="group relative flex w-full shrink-0 cursor-pointer flex-col items-center pt-2.5 pb-2 select-none"
      >
        {/* Pill de arrastre */}
        <div className="h-1.5 w-12 rounded-full bg-white/30 transition-all group-hover:bg-white/50 group-active:scale-95" />

        {/* Texto animado cuando está colapsado */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-cyan-200/90"
          >
            <ChevronUp className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
            <span className="drop-shadow">Desliza para ver el planning de hoy</span>
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          </motion.div>
        )}
      </div>

      {/* ================= CABECERA DEL DRAWER (Cuando está expandido) ================= */}
      {isOpen && (
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 pt-1 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(0,191,255,0.3)]">
              <Compass className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                Bitácora de Viaje
              </h3>
              <p className="text-[11px] text-white/55">
                Itinerario y planning en tiempo real
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              hapticTap();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            aria-label="Cerrar bitácora"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
      )}

      {/* ================= LÍNEA DE TIEMPO VERTICAL (TIMELINE) ================= */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-28">
        {days.map((day) => {
          const isSolved = unlockedDays.includes(day.id);
          const isActive = day.id === activeDayId;
          const isFuture = !isSolved && !isActive;

          // ================= CASO 1: DÍA ACTIVO DESTACADO =================
          if (isActive) {
            return (
              <motion.div
                key={day.id}
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative overflow-hidden rounded-2xl border-2 border-cyan-400/60 bg-gradient-to-b from-cyan-950/40 via-slate-900/60 to-slate-950/80 p-5 shadow-[0_0_35px_rgba(0,191,255,0.25)] backdrop-blur-xl"
              >
                {/* Acento superior de luz neón */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amber-400/15 blur-2xl" />

                {/* Cabecera del día activo */}
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3.5 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
                        Hoy en vivo
                      </span>
                      <span className="text-xs font-mono text-cyan-200/70">
                        Día {day.id} · {formatUnlockDate(day.unlockDate)}
                      </span>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-white drop-shadow">
                      {day.title}
                    </h4>
                  </div>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-[#FFD700] border border-amber-400/30">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>

                {/* Resumen & Etiquetas de Destino / Ropa si existen */}
                {day.dailyPlan?.summary && (
                  <p className="text-sm font-serif italic text-white/95 leading-relaxed mb-3">
                    “{day.dailyPlan.summary}”
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {day.dailyPlan?.destination && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-200">
                      <MapPin className="h-3 w-3 text-cyan-400" />
                      {day.dailyPlan.destination}
                    </span>
                  )}
                  {day.dailyPlan?.dressCode && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200">
                      <Shirt className="h-3 w-3 text-amber-400" />
                      {day.dailyPlan.dressCode}
                    </span>
                  )}
                </div>

                {/* Lista cronológica de eventos (Timeline) */}
                {day.dailyPlan?.timeline && day.dailyPlan.timeline.length > 0 ? (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-cyan-500/50 before:to-amber-400/40">
                    {day.dailyPlan.timeline.map((event, eIdx) => (
                      <div key={eIdx} className="relative group">
                        {/* Nodo en la línea vertical */}
                        <div
                          className={`absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border ${
                            event.isHighlight
                              ? "border-amber-400 bg-amber-500 text-slate-950 shadow-[0_0_12px_#FFD700]"
                              : "border-cyan-400 bg-slate-950 text-cyan-300"
                          }`}
                        >
                          <EventTypeIcon type={event.type} />
                        </div>

                        {/* Contenido del evento */}
                        <div
                          className={`rounded-xl border p-3 transition-all ${
                            event.isHighlight
                              ? "border-amber-400/40 bg-amber-400/10 shadow-sm"
                              : "border-white/10 bg-white/5"
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-cyan-300">
                              {event.time}
                            </span>
                            {event.isHighlight && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.2 rounded-full">
                                Especial
                              </span>
                            )}
                          </div>

                          <h5 className="font-medium text-sm text-white mt-0.5">
                            {event.title}
                          </h5>

                          {event.description && (
                            <p className="text-xs text-white/75 mt-1 leading-relaxed">
                              {event.description}
                            </p>
                          )}

                          {event.location && (
                            <div className="flex items-center gap-1 text-[11px] text-cyan-200/80 mt-1.5">
                              <MapPin className="h-3 w-3 text-cyan-400" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback cuando aún no se ha introducido el planning exacto
                  <div className="rounded-xl border border-dashed border-cyan-400/30 bg-cyan-950/20 p-4 text-center space-y-1.5">
                    <Compass className="h-5 w-5 text-cyan-400 mx-auto animate-spin" style={{ animationDuration: "12s" }} />
                    <p className="text-xs text-cyan-200/90 font-medium">
                      Planning secreto en preparación para este día
                    </p>
                    <p className="text-[11px] text-white/50">
                      (Podrás configurarlo en <code>gymkanaConfig.ts</code> en cualquier momento)
                    </p>
                  </div>
                )}
              </motion.div>
            );
          }

          // ================= CASO 2: DÍAS ANTERIORES RESUELTOS =================
          if (isSolved) {
            return (
              <div
                key={day.id}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-4 opacity-75 transition-opacity hover:opacity-95"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[11px] font-mono text-emerald-300/80">
                        Día {day.id} · {formatUnlockDate(day.unlockDate)}
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {day.title}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400/80 font-medium">
                    Vivido
                  </span>
                </div>

                {day.dailyPlan?.summary && (
                  <p className="mt-2 text-xs font-serif italic text-white/70 pl-6">
                    “{day.dailyPlan.summary}”
                  </p>
                )}
              </div>
            );
          }

          // ================= CASO 3: DÍAS FUTUROS BLOQUEADOS =================
          return (
            <div
              key={day.id}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 select-none opacity-45"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/40">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-white/40">
                      Día {day.id} · Se desbloquea el {formatUnlockDate(day.unlockDate)}
                    </span>
                    <h4 className="text-sm font-medium text-white/60 blur-[1px]">
                      Etapa secreta por descubrir
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-mono text-white/30">???</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default DailyPlanDrawer;
