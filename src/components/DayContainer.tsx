"use client";

import { useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock, LockOpen } from "lucide-react";
import type { DayConfig } from "@/types/gymkana";
import { verifyPassword } from "@/lib/hash";
import { dayComponents } from "@/components/days";
import { DAY_ICONS } from "@/components/ui/dayIcons";

/**
 * Tarjeta del día: hoja de cristal esmerilado que sube sobre el canvas 3D
 * una vez la cámara ha llegado a la esfera.
 *
 * Sigue siendo el componente GENÉRICO de la app: gestiona el gate de
 * contraseña (hash SHA-256, shake al fallar) y delega el contenido concreto
 * al componente aislado Day{n} registrado en `dayComponents`.
 *
 * Diseño pensado solo para móvil en vertical: ocupa casi toda la pantalla,
 * tipografía grande, y se puede cerrar arrastrando hacia abajo o con el botón.
 */
export function DayContainer({
  config,
  isUnlocked,
  onUnlock,
  onClose,
}: {
  config: DayConfig;
  isUnlocked: boolean;
  onUnlock: () => void;
  onClose: () => void;
}) {
  const [passwordInput, setPasswordInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const DaySpecificComponent = dayComponents[config.id];
  const DayIcon = config.lucideIcon ? DAY_ICONS[config.lucideIcon] : null;
  const showPasswordGate = config.requiresPassword && !isUnlocked;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking) return;
    setChecking(true);
    const isValid = await verifyPassword(passwordInput, config.passwordHashes);
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
    <motion.section
      key={config.id}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 260 }}
      drag="y"
      dragDirectionLock
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 130 || info.velocity.y > 650) onClose();
      }}
      // Cristal OSCURO, no blanco translúcido: detrás está la esfera a la que
      // acaba de volar la cámara, y su resplandor lavaba el panel dejando el
      // texto casi ilegible. Este tinte garantiza contraste pase lo que pase.
      className="fixed inset-x-0 bottom-0 z-20 flex h-[92dvh] flex-col
        rounded-t-[2rem] border-t border-white/25
        bg-[#150c2b]/85 shadow-[0_-8px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl
        before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px
        before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent"
    >
      {/* Asa de arrastre */}
      <div className="flex shrink-0 justify-center pt-3 pb-1">
        <div className="h-1.5 w-12 rounded-full bg-white/30" />
      </div>

      {/* Cabecera */}
      <header className="flex shrink-0 items-start justify-between gap-3 px-6 pt-2 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          {DayIcon && (
            <span
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                bg-fuchsia-400/15 text-fuchsia-200"
            >
              <DayIcon className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-fuchsia-200/70">
              Día {config.id}
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight text-white">{config.title}</h2>
          </div>
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
              isUnlocked ? "bg-amber-400/20 text-amber-300" : "bg-white/10 text-white/60"
            }`}
          >
            {isUnlocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </motion.span>
        </div>
      </header>

      {/* Contenido con scroll propio */}
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 pb-6">
        {/* El componente del día se pinta SIEMPRE, también cuando hay gate de
            contraseña: hay días cuyo reto vive dentro del componente (p. ej. el
            Día 3 muestra los emojis de la canción) y la clave solo se puede
            adivinar viéndolo. Los días que no tienen nada que enseñar antes de
            desbloquear devuelven null por su cuenta. */}
        {DaySpecificComponent && (
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

        {showPasswordGate && (
          <motion.form
            key={shakeKey}
            onSubmit={handleSubmit}
            animate={showError ? { x: [0, -10, 10, -10, 10, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-5"
          >
            <p className="text-lg leading-relaxed text-white/90">{config.riddle}</p>
            {config.hintExtra && (
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm italic leading-relaxed text-white/65">
                {config.hintExtra}
              </p>
            )}
            {config.audioHintSrc && (
              <audio controls className="w-full" src={config.audioHintSrc}>
                Tu navegador no soporta audio.
              </audio>
            )}

            <div className="space-y-3">
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
                // 16px exactos: por debajo, iOS Safari hace zoom al enfocar.
                style={{ fontSize: 16 }}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white
                  placeholder-white/40 outline-none transition focus:border-fuchsia-300/60 focus:bg-white/15"
              />
              <motion.button
                type="submit"
                whileTap={checking || passwordInput.length === 0 ? undefined : { scale: 0.97 }}
                disabled={checking || passwordInput.length === 0}
                className="w-full rounded-2xl bg-gradient-to-r from-rose-400 via-fuchsia-500 to-violet-500
                  px-5 py-4 text-base font-semibold text-white shadow-lg
                  disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="text-center text-sm font-medium text-rose-300"
                >
                  Clave incorrecta. ¡Inténtalo de nuevo!
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </div>

      {/* Volver a la nebulosa */}
      <div className="shrink-0 border-t border-white/10 px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <motion.button
          type="button"
          onClick={onClose}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15
            bg-white/5 px-5 py-4 text-sm font-medium text-white/80"
        >
          <ChevronDown className="h-4 w-4" />
          Volver a la nebulosa
        </motion.button>
      </div>
    </motion.section>
  );
}
