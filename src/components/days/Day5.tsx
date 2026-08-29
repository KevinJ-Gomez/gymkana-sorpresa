"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, AlertCircle, RotateCcw, CheckCircle, Utensils, Heart, Swords, ShieldAlert, Gift } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

/**
 * Día 5: El Gran Duelo de Pareja.
 * Reto de 5 preguntas con 0 fallos permitidos.
 * - Instrucciones iniciales sin desvelar el premio ni el castigo.
 * - Si acierta las 5: Gana el vale de comida/cena organizada y pagada.
 * - Si falla: Pantalla cómica de derrota con la apuesta y botón de reintento.
 */
export function Day5({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const questions = config.quizQuestions ?? [];
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFailed, setIsFailed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Helper para validar si una opción es correcta
  const checkIsOptionCorrect = (qIndex: number, optIndex: number): boolean => {
    const q = questions[qIndex];
    if (!q) return false;
    if (q.correctIndices && q.correctIndices.includes(optIndex)) return true;
    return q.correctIndex === optIndex;
  };

  const handleSelectOption = (optIndex: number) => {
    if (isChecking || isFailed) return;

    setSelectedOption(optIndex);
    setIsChecking(true);

    const isCorrect = checkIsOptionCorrect(currentIndex, optIndex);

    setTimeout(() => {
      if (isCorrect) {
        if (currentIndex + 1 < questions.length) {
          // Siguiente pregunta
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsChecking(false);
        } else {
          // ¡Ha acertado las 5 preguntas!
          setIsChecking(false);
          if (onUnlock) onUnlock();
        }
      } else {
        // Fallo: pierde la apuesta
        setIsFailed(true);
        setIsChecking(false);
      }
    }, 600);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsFailed(false);
    setIsChecking(false);
    setHasStarted(false);
  };

  // ==========================================
  // PANTALLA 1: PREMIO / VALE GANADO (isUnlocked)
  // ==========================================
  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        {/* Glows dorados y rosados */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-pink-500/25 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center space-y-5">
          {/* Badge de victoria */}
          <div className="flex items-center justify-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 backdrop-blur-md">
            <Trophy className="h-4 w-4 text-amber-300" />
            <span>¡Apuesta Ganada Impecable! (5/5)</span>
            <Sparkles className="h-4 w-4 text-amber-300" />
          </div>

          {/* Título de la recompensa */}
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {config.rewardTitle || "¡Vale Digital Desbloqueado!"}
          </h3>

          <p className="max-w-md text-sm sm:text-base text-white/90 leading-relaxed">
            {config.rewardDescription}
          </p>

          {/* Ticket Dorado / Vale Oficial */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-dashed border-amber-300/60 bg-gradient-to-br from-amber-500/20 via-pink-500/15 to-purple-900/40 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-amber-300/30 pb-3 mb-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm uppercase tracking-wider">
                <Utensils className="h-4 w-4" />
                <span>Ticket Oficial de Regalo</span>
              </div>
              <span className="text-[10px] font-mono bg-amber-400/30 text-amber-200 px-2 py-0.5 rounded-full">
                #CENA-CUMPLE-30
              </span>
            </div>

            <p className="font-serif text-lg sm:text-xl font-medium text-white leading-relaxed drop-shadow">
              {config.voucherText ||
                "1 Comida o Cena a tu elección, pagada y organizada al 100% por mí, cuando tú quieras y sin mirar el precio 🍽️💖"}
            </p>

            <div className="mt-4 pt-3 border-t border-amber-300/20 flex items-center justify-center gap-2 text-xs text-amber-200/90 font-medium">
              <Heart className="h-3.5 w-3.5 text-pink-400 fill-pink-400" />
              <span>Válido para canjear cuando a ti te apetezca</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // PANTALLA 2: DERROTA / APUESTA PERDIDA
  // ==========================================
  if (isFailed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-5 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-6 sm:p-7 text-center backdrop-blur-xl shadow-2xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/20 text-rose-300">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold text-white">
            ¡Has perdido la apuesta! 😜
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-rose-100/90">
            La regla era <strong>0 fallos</strong>... ¡así que me debes una cena o almuerzo pagada y organizada por ti cuando yo quiera! 🍽️✨
          </p>
          <p className="text-xs text-white/60 italic pt-1">
            Pero como soy generoso, puedes volver a intentarlo para intentar ganar tu vale:
          </p>
        </div>

        <button
          type="button"
          onClick={resetQuiz}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Volver a intentarlo</span>
        </button>
      </motion.div>
    );
  }

  // ==========================================
  // PANTALLA 3: INSTRUCCIONES DEL DUELO (ANTES DE EMPEZAR)
  // ==========================================
  if (!hasStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-7 text-center backdrop-blur-xl shadow-2xl"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-300 backdrop-blur-md">
          <Swords className="h-4 w-4 text-pink-300" />
          <span>Duelo de Pareja</span>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow">
            ¿Cuánto nos conoces?
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Ha llegado el momento de poner a prueba tu memoria con 5 preguntas sobre nuestra historia, viajes y manías.
          </p>
        </div>

        {/* Reglas del Reto */}
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-xs sm:text-sm text-white/90">
          <div className="flex items-start gap-2.5">
            <span className="text-base">🎯</span>
            <p><strong>5 Preguntas en total</strong> sobre nosotros.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
            <p><strong className="text-amber-200">0 Fallos permitidos:</strong> un solo error y perderás el duelo.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <Gift className="h-4 w-4 text-pink-300 shrink-0 mt-0.5" />
            <p><strong>Si aciertas las 5:</strong> Desbloquearás una recompensa muy especial para ti.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-base">😈</span>
            <p><strong>Si fallas:</strong> ¡Pierdes la apuesta y tendrás que pagar el castigo!</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHasStarted(true)}
          className="w-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 px-6 py-4 font-semibold text-white shadow-xl transition hover:scale-[1.02] active:scale-95 text-base"
        >
          ¡Acepto el reto! 🚀
        </button>
      </motion.div>
    );
  }

  // ==========================================
  // PANTALLA 4: PREGUNTAS DEL QUIZ (PASO A PASO)
  // ==========================================
  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-5">
      {/* Cabecera del reto y apuesta */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-pink-300 px-1">
          <span>Pregunta {currentIndex + 1} de {questions.length}</span>
          <span>0 Fallos permitidos</span>
        </div>

        {/* Barra de progreso */}
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Pregunta activa */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center shadow-lg backdrop-blur-md">
            <h4 className="font-serif text-lg sm:text-xl font-medium text-white leading-relaxed">
              {currentQuestion.question}
            </h4>
          </div>

          {/* Lista de opciones */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = checkIsOptionCorrect(currentIndex, optIdx);

              let buttonStyles = "border-white/15 bg-white/5 text-white/90 hover:bg-white/15 active:bg-white/20";
              if (isSelected) {
                if (isCorrect) {
                  buttonStyles = "border-emerald-400 bg-emerald-500/30 text-white ring-2 ring-emerald-400";
                } else {
                  buttonStyles = "border-rose-400 bg-rose-500/30 text-white ring-2 ring-rose-400";
                }
              }

              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isChecking}
                  whileTap={isChecking ? undefined : { scale: 0.98 }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm sm:text-base font-medium transition-all shadow-md backdrop-blur-md select-none ${buttonStyles}`}
                >
                  <span>{option}</span>
                  {isSelected && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-emerald-300" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-300" />
                      )}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Day5;
