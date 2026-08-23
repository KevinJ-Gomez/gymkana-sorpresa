"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Gift } from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";

/** Día 5: quiz de pareja. Al acertar todas las preguntas, desbloquea el vale digital. */
export function Day5({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const questions = config.quizQuestions ?? [];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState<"none" | "wrong">("none");

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-3 text-center"
      >
        <Gift className="mx-auto h-8 w-8 text-rose-300" />
        <h3 className="text-lg font-semibold text-white">{config.rewardTitle}</h3>
        {config.voucherText && (
          <p className="rounded-xl border border-dashed border-white/30 bg-white/5 p-4 text-white/90">
            {config.voucherText}
          </p>
        )}
      </motion.div>
    );
  }

  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);

  function handleCheck() {
    const allCorrect = questions.every((q, i) => answers[i] === q.correctIndex);
    if (allCorrect) {
      onUnlock();
    } else {
      setShowResult("wrong");
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-white/85">{config.riddle}</p>

      {questions.map((q, qIndex) => (
        <div key={q.question} className="space-y-2">
          <p className="text-sm font-medium text-white/90">{q.question}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {q.options.map((option, oIndex) => {
              const selected = answers[qIndex] === oIndex;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
                    setShowResult("none");
                  }}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "border-rose-300/70 bg-rose-400/20 text-white"
                      : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
                  }`}
                >
                  {option}
                  {selected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleCheck}
        disabled={!allAnswered}
        className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-fuchsia-500 px-5 py-2.5 font-medium text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Comprobar respuestas
      </button>

      {showResult === "wrong" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-medium text-rose-300"
        >
          Alguna respuesta falla... ¡vuelve a intentarlo!
        </motion.p>
      )}
    </div>
  );
}

export default Day5;
