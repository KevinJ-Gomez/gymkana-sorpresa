"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, AlertCircle, RotateCcw, CheckCircle, Utensils, Heart, Swords, ShieldAlert, Gift } from "lucide-react";
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
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-petal-300/40 bg-[#faf0f4] p-6 sm:p-8 text-center shadow-lg"
      >
        <div className="relative z-10 flex flex-col items-center space-y-5">
          {/* Badge de victoria */}
          <div className="flex items-center justify-center gap-2 rounded-full border border-amber-400/50 bg-amber-100 px-4 py-1.5 text-xs font-serif font-semibold uppercase tracking-wider text-amber-900 shadow-xs">
            <Trophy className="h-4 w-4 text-amber-700" />
            <span>¡Apuesta Ganada Impecable! (5/5)</span>
            <Heart className="h-4 w-4 fill-[#be185d] text-[#be185d]" />
          </div>

          {/* Título de la recompensa */}
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1d2e]">
            {config.rewardTitle || "¡Vale Digital Desbloqueado!"}
          </h3>

          <p className="max-w-md font-serif text-sm sm:text-base text-[#4a1d2e] leading-relaxed">
            {config.rewardDescription}
          </p>

          {/* Ticket Dorado / Vale Oficial */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-dashed border-amber-400/60 bg-gradient-to-br from-[#2a0e36] via-[#1a0724] to-[#0c0312] p-6 shadow-2xl">
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
              <Heart className="h-3.5 w-3.5 text-petal-400 fill-petal-400" />
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
        className="space-y-5 rounded-2xl border border-petal-300/40 bg-[#faf0f4] p-6 sm:p-7 text-center shadow-lg"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fce7f3] text-[#be185d] border border-petal-300/50">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold text-[#4a1d2e]">
            ¡Has perdido la apuesta! 😜
          </h3>
          <p className="font-serif text-sm sm:text-base leading-relaxed text-[#4a1d2e]">
            La regla era <strong>0 fallos</strong>... ¡así que me debes una cena o almuerzo pagada y organizada por ti cuando yo quiera! 🍽️✨
          </p>
          <p className="text-xs text-[#9d5272] italic pt-1">
            Pero como soy generoso, puedes volver a intentarlo para intentar ganar tu vale:
          </p>
        </div>

        <button
          type="button"
          onClick={resetQuiz}
          className="primary-action inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-petal-600 to-petal-700 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
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
        className="space-y-5 rounded-2xl border border-petal-300/40 bg-[#faf0f4] p-6 sm:p-7 text-center shadow-lg"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-petal-300/60 bg-[#fce7f3] px-4 py-1.5 text-xs font-serif font-semibold uppercase tracking-wider text-[#be185d] shadow-xs">
          <Swords className="h-4 w-4 text-[#be185d]" />
          <span>Duelo de Pareja</span>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1d2e]">
            ¿Cuánto nos conoces?
          </h3>
          <p className="font-serif text-sm text-[#4a1d2e] leading-relaxed">
            Ha llegado el momento de poner a prueba tu memoria con 5 preguntas sobre nuestra historia, viajes y manías.
          </p>
        </div>

        {/* Reglas del Reto */}
        <div className="space-y-3 rounded-xl border border-petal-300/40 bg-white p-4 text-left text-xs sm:text-sm text-[#4a1d2e] shadow-xs">
          <div className="flex items-start gap-2.5">
            <span className="text-base">🎯</span>
            <p><strong>5 Preguntas en total</strong> sobre nosotros.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p><strong className="text-amber-800">0 Fallos permitidos:</strong> un solo error y perderás el duelo.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <Gift className="h-4 w-4 text-[#be185d] shrink-0 mt-0.5" />
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
          className="primary-action w-full rounded-full bg-gradient-to-r from-petal-600 via-petal-700 to-petal-800 px-6 py-4 font-semibold text-white shadow-xl transition hover:scale-[1.02] active:scale-95 text-base cursor-pointer"
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
        <div className="flex items-center justify-between text-xs font-serif font-semibold uppercase tracking-wider text-[#9d5272] px-1">
          <span>Pregunta {currentIndex + 1} de {questions.length}</span>
          <span>0 Fallos permitidos</span>
        </div>

        {/* Barra de progreso */}
        <div className="h-1.5 w-full rounded-full bg-petal-200/50 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-petal-500 to-petal-700"
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
          <div className="rounded-2xl border border-petal-300/40 bg-white p-5 text-center shadow-xs">
            <h4 className="font-serif text-lg sm:text-xl font-medium text-[#4a1d2e] leading-relaxed">
              {currentQuestion.question}
            </h4>
          </div>

          {/* Lista de opciones */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = checkIsOptionCorrect(currentIndex, optIdx);

              let buttonStyles = "border-petal-200 bg-white text-[#4a1d2e] hover:bg-[#faf0f4] active:bg-petal-50 shadow-xs";
              if (isSelected) {
                if (isCorrect) {
                  buttonStyles = "border-petal-500 bg-gradient-to-r from-petal-600 to-petal-700 text-white ring-2 ring-petal-400 shadow-md";
                } else {
                  buttonStyles = "border-red-400 bg-red-100 text-red-900 ring-2 ring-red-400/50";
                }
              }

              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isChecking}
                  whileTap={isChecking ? undefined : { scale: 0.98 }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm sm:text-base font-medium transition-all shadow-xs select-none cursor-pointer ${buttonStyles}`}
                >
                  <span>{option}</span>
                  {isSelected && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
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
