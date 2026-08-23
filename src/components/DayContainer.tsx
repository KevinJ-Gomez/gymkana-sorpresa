"use client";

import { useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Lock, LockOpen } from "lucide-react";
import type { DayConfig } from "@/types/gymkana";
import { verifyPassword } from "@/lib/hash";
import { GlassCard } from "@/components/ui/GlassCard";
import { dayComponents } from "@/components/days";

/**
 * Componente genérico que gestiona TODA la lógica común a un día:
 * - Si `requiresPassword`, pinta el formulario de contraseña, la valida
 *   (hash SHA-256) y dispara shake/errores o la animación de desbloqueo.
 * - Delega el contenido específico (acertijo interno, minijuego o premio)
 *   al componente aislado Day{n} registrado en `dayComponents`.
 */
export function DayContainer({
  config,
  isUnlocked,
  onUnlock,
  onBack,
}: {
  config: DayConfig;
  isUnlocked: boolean;
  onUnlock: () => void;
  onBack: () => void;
}) {
  const [passwordInput, setPasswordInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const DaySpecificComponent = dayComponents[config.id];
  const showPasswordGate = config.requiresPassword && !isUnlocked;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking) return;
    setChecking(true);
    const isValid = await verifyPassword(passwordInput, config.passwordHash);
    setChecking(false);

    if (isValid) {
      setShowError(false);
      onUnlock();
    } else {
      setShowError(true);
      setShakeKey((key) => key + 1);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-2xl"
    >
      <motion.button
        onClick={onBack}
        whileTap={{ scale: 0.96 }}
        className="-ml-2 mb-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-2.5 text-sm text-white/70 active:text-white sm:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al calendario
      </motion.button>

      <GlassCard>
        <header className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/60">Día {config.id}</p>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">{config.title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {config.giftLabel && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
                🎁 {config.giftLabel}
              </span>
            )}
            <motion.span
              animate={{ scale: isUnlocked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isUnlocked ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-white/60"
              }`}
            >
              {isUnlocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </motion.span>
          </div>
        </header>

        {showPasswordGate && (
          <motion.form
            key={shakeKey}
            onSubmit={handleSubmit}
            animate={
              showError ? { x: [0, -10, 10, -10, 10, -6, 6, 0] } : { x: 0 }
            }
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <p className="leading-relaxed text-white/90">{config.riddle}</p>
            {config.hintExtra && (
              <p className="text-sm italic text-white/60">{config.hintExtra}</p>
            )}
            {config.audioHintSrc && (
              <audio controls className="w-full rounded-lg" src={config.audioHintSrc}>
                Tu navegador no soporta audio.
              </audio>
            )}

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                type="text"
                inputMode="text"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (showError) setShowError(false);
                }}
                placeholder={config.passwordPlaceholder ?? "Escribe la clave..."}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                style={{ fontSize: 16 }}
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-white/50 focus:bg-white/15"
              />
              <motion.button
                type="submit"
                whileTap={checking || passwordInput.length === 0 ? undefined : { scale: 0.96 }}
                disabled={checking || passwordInput.length === 0}
                className="rounded-xl bg-gradient-to-r from-rose-400 to-fuchsia-500 px-5 py-3 font-medium text-white shadow-lg transition sm:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checking ? "Comprobando..." : "Desbloquear"}
              </motion.button>
            </div>

            <AnimatePresence>
              {showError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm font-medium text-rose-300"
                >
                  Clave incorrecta. ¡Inténtalo de nuevo!
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}

        {!showPasswordGate && DaySpecificComponent && (
          <AnimatePresence mode="wait">
            <motion.div
              key={isUnlocked ? "reward" : "challenge"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DaySpecificComponent config={config} isUnlocked={isUnlocked} onUnlock={onUnlock} />
            </motion.div>
          </AnimatePresence>
        )}
      </GlassCard>
    </motion.div>
  );
}
