"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Eye,
  AlertTriangle,
  Check,
  Lock,
  Unlock,
  HelpCircle,
  Clock,
} from "lucide-react";
import { hapticError, hapticScratch, hapticSuccess, hapticTap } from "@/lib/haptics";

function checkHapticThrottle(lastRef: { current: number }, threshold = 80): boolean {
  const now = performance.now();
  if (now - lastRef.current > threshold) {
    lastRef.current = now;
    return true;
  }
  return false;
}

const TARGET_BIRTHDAY = new Date("2026-10-12T00:00:00+02:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = TARGET_BIRTHDAY - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

const VALID_ANSWERS = [
  "bolso",
  "el bolso",
  "un bolso",
  "bolsito",
  "el bolsito",
  "cartera",
  "la cartera",
  "bandolera",
  "la bandolera",
  "bolso michael kors",
  "michael kors",
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type Step = "riddle" | "dilemma" | "waiting" | "scratch1" | "scratch2";

export function SpoilerExperience() {
  const [step, setStep] = useState<Step>("riddle");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  const [riddleInput, setRiddleInput] = useState("");
  const [riddleError, setRiddleError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [isPhotoScratched, setIsPhotoScratched] = useState(false);
  const [isHandbagRevealed, setIsHandbagRevealed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasStartedScratch1, setHasStartedScratch1] = useState(false);
  const [hasStartedScratch2, setHasStartedScratch2] = useState(false);

  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const isDrawing1 = useRef(false);
  const lastHaptic1 = useRef(0);

  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const isDrawing2 = useRef(false);
  const lastHaptic2 = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyRiddle = () => {
    const normalized = normalizeText(riddleInput);
    if (VALID_ANSWERS.includes(normalized)) {
      hapticSuccess();
      setRiddleError(false);
      setStep("dilemma");
    } else {
      hapticError();
      setRiddleError(true);
    }
  };

  // =========================================================================
  // Canvas 1: Primer Rasca (Foto con bolso tapado)
  // =========================================================================
  useEffect(() => {
    if (step !== "scratch1" || isPhotoScratched) return;
    const canvas = canvas1Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#fbbf24");
    grad.addColorStop(0.3, "#fef08a");
    grad.addColorStop(0.5, "#f59e0b");
    grad.addColorStop(0.7, "#fef08a");
    grad.addColorStop(1, "#d97706");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(rx, ry, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#78350f";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Rasca con el dedo", canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = "12px sans-serif";
    ctx.fillText("Desliza para ver la foto", canvas.width / 2, canvas.height / 2 + 14);
  }, [step, isPhotoScratched]);

  function scratch1(clientX: number, clientY: number) {
    const canvas = canvas1Ref.current;
    if (!canvas || isPhotoScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!hasStartedScratch1) setHasStartedScratch1(true);
    if (checkHapticThrottle(lastHaptic1)) hapticScratch();

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    checkProgress1();
  }

  function checkProgress1() {
    const canvas = canvas1Ref.current;
    if (!canvas || isPhotoScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparent = 0;
      const total = data.length / 64;

      for (let i = 3; i < data.length; i += 64) {
        if (data[i] === 0) transparent++;
      }

      if (transparent / total > 0.38) {
        setIsPhotoScratched(true);
        hapticSuccess();
      }
    } catch {
      // Silencioso
    }
  }

  // =========================================================================
  // Canvas 2: Mini-rasca que borra la censura del bolso
  // =========================================================================
  useEffect(() => {
    if (step !== "scratch2" || isHandbagRevealed) return;
    const canvas = canvas2Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const img = new window.Image();
    img.src = "/images/spoiler-censored.jpg";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [step, isHandbagRevealed]);

  function scratch2(clientX: number, clientY: number) {
    const canvas = canvas2Ref.current;
    if (!canvas || isHandbagRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!hasStartedScratch2) setHasStartedScratch2(true);
    if (checkHapticThrottle(lastHaptic2)) hapticScratch();

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkProgress2();
  }

  function checkProgress2() {
    const canvas = canvas2Ref.current;
    if (!canvas || isHandbagRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const startX = Math.floor(canvas.width * 0.28);
      const endX = Math.floor(canvas.width * 0.65);
      const startY = Math.floor(canvas.height * 0.45);
      const endY = Math.floor(canvas.height * 0.65);
      const width = endX - startX;
      const height = endY - startY;

      const imgData = ctx.getImageData(startX, startY, width, height);
      const data = imgData.data;
      let transparent = 0;
      const total = data.length / 32;

      for (let i = 3; i < data.length; i += 32) {
        if (data[i] === 0) transparent++;
      }

      if (transparent / total > 0.32) {
        setIsHandbagRevealed(true);
        hapticSuccess();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#fb7185", "#fbbf24", "#ffffff"],
        });
      }
    } catch {
      // Silencioso
    }
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto overscroll-contain touch-pan-y bg-[#0b0620] px-4 py-5 text-white">
      {/* Fondo sutil */}
      <div className="pointer-events-none fixed -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-500/15 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-sm space-y-4">
        {/* ================================================================= */}
        {/* CONTADOR DE DÍAS HASTA EL CUMPLEAÑOS (12 DE OCTUBRE)              */}
        {/* ================================================================= */}
        <div className="rounded-2xl border border-pink-500/25 bg-black/40 p-3.5 text-center shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-pink-300">
            <Clock className="h-3 w-3 text-pink-400" />
            <span>Cuenta atrás para tu cumpleaños</span>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-xl font-bold text-white">{timeLeft.days}</span>
              <span className="text-[9px] uppercase text-pink-200/70">Días</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-xl font-bold text-white">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase text-pink-200/70">Horas</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/5 py-1.5 border border-white/10">
              <span className="font-mono text-xl font-bold text-white">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase text-pink-200/70">Min</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-pink-500/20 py-1.5 border border-pink-400/30">
              <span className="font-mono text-xl font-bold text-pink-400 animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase text-pink-300">Seg</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* INSTRUCCIONES Y EXPLICACIÓN DEL SPOILER                            */}
        {/* ================================================================= */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-left backdrop-blur-md shadow-md">
          <p className="text-xs leading-relaxed text-white/90">
            Esto es un pequeño preview de la sorpresa que te espera para tu cumpleaños. Una vez hayas terminado aquí, <strong>vuelve el día 2 de octubre</strong> para empezar tu sorpresa.
          </p>
        </div>

        {/* ================================================================= */}
        {/* PASO 1: EL ACERTIJO                                               */}
        {/* ================================================================= */}
        {step === "riddle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-400/30 bg-black/40 p-4 text-center space-y-3 backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300">
              <Lock className="h-4 w-4" />
              <span>Resuelve el acertijo para desbloquear la sorpresa</span>
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs italic text-amber-100 text-left">
              “Tengo asas pero no vuelo, guardo tus secretos y me llevas colgado a tu lado en cada aventura... ¿Qué accesorio soy?”
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={riddleInput}
                  onChange={(e) => {
                    setRiddleInput(e.target.value);
                    setRiddleError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyRiddle()}
                  placeholder="Tu respuesta..."
                  className="w-full rounded-xl border border-white/20 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyRiddle}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2.5 text-xs font-semibold text-white active:scale-95 transition"
                >
                  Probar
                </button>
              </div>

              {riddleError && (
                <p className="text-[11px] text-rose-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Respuesta incorrecta. Prueba otra vez.</span>
                </p>
              )}

              {!showHint ? (
                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setShowHint(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-300/80 hover:text-amber-200 underline pt-0.5"
                >
                  <HelpCircle className="h-3 w-3" />
                  <span>Pista</span>
                </button>
              ) : (
                <p className="rounded-lg border border-amber-400/20 bg-black/40 p-2 text-[11px] text-amber-200/90 text-left">
                  💡 Pista: Es un accesorio donde guardas las llaves o el móvil y te lo llevas colgado.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* PASO 2: ELECCIÓN (Ver sorpresa o esperar)                          */}
        {/* ================================================================= */}
        {step === "dilemma" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-400/30 bg-black/40 p-5 text-center space-y-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Unlock className="h-4 w-4" />
              <span>Acertijo correcto</span>
            </div>

            <p className="text-xs text-white/90">
              ¿Quieres ver la sorpresa del bolso ahora o prefieres esperar al día correspondiente?
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  setStep("scratch1");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 p-3 text-xs font-semibold text-white shadow-md active:scale-95 transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Ver la sorpresa del bolso</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  setStep("waiting");
                }}
                className="w-full rounded-xl border border-white/20 bg-white/5 p-2.5 text-xs font-medium text-white/75 active:scale-95 transition"
              >
                Esperar al día correspondiente
              </button>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* ESPERAR AL DÍA CORRESPONDIENTE                                    */}
        {/* ================================================================= */}
        {step === "waiting" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/20 bg-black/40 p-5 text-center space-y-4 backdrop-blur-md"
          >
            <p className="text-xs text-white/90">
              Has elegido esperar. Vuelve el <strong>2 de octubre</strong> para empezar tu sorpresa.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  hapticTap();
                  setStep("scratch1");
                }}
                className="text-[11px] text-pink-300 underline"
              >
                Cambiar de opinión y ver la foto
              </button>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* PASO 3: PRIMER RASCA (FOTO CON BOLSO TAPADO)                       */}
        {/* ================================================================= */}
        {step === "scratch1" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-center"
          >
            <p className="text-xs font-medium text-pink-300">
              {isPhotoScratched ? "Foto descubierta" : "Rasca con tu dedo para ver la foto"}
            </p>

            <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl border border-pink-400/30 bg-black/50 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/spoiler-censored.jpg"
                alt="Foto"
                className="h-full w-full object-cover object-center"
              />

              <AnimatePresence>
                {!isPhotoScratched && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    className="absolute inset-0 z-10 touch-none"
                  >
                    <canvas
                      ref={canvas1Ref}
                      onPointerDown={(e) => {
                        isDrawing1.current = true;
                        scratch1(e.clientX, e.clientY);
                      }}
                      onPointerMove={(e) => {
                        if (isDrawing1.current) scratch1(e.clientX, e.clientY);
                      }}
                      onPointerUp={() => {
                        isDrawing1.current = false;
                      }}
                      onPointerCancel={() => {
                        isDrawing1.current = false;
                      }}
                      className="h-full w-full cursor-pointer"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isPhotoScratched && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 pt-1"
              >
                <p className="text-xs text-white/70">
                  El bolso está tapado. ¿Deseas destaparlo también?
                </p>

                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setShowConfirmModal(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-xs font-semibold text-white shadow-md active:scale-95 transition"
                >
                  <Eye className="h-4 w-4" />
                  <span>Destapar bolso</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* PASO 4: SEGUNDO MINI-RASCA (DESTAPAR EL BOLSO)                     */}
        {/* ================================================================= */}
        {step === "scratch2" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3 text-center"
          >
            <p className="text-xs font-medium text-pink-300">
              {isHandbagRevealed ? "Bolso al descubierto" : "Rasca sobre la zona negra para quitar la censura"}
            </p>

            <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl border border-pink-400/40 bg-black/50 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/spoiler-original.jpg"
                alt="Bolso revelado"
                className="h-full w-full object-cover object-center"
              />

              <AnimatePresence>
                {!isHandbagRevealed && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.6 } }}
                    className="absolute inset-0 z-10 touch-none"
                  >
                    <canvas
                      ref={canvas2Ref}
                      onPointerDown={(e) => {
                        isDrawing2.current = true;
                        scratch2(e.clientX, e.clientY);
                      }}
                      onPointerMove={(e) => {
                        if (isDrawing2.current) scratch2(e.clientX, e.clientY);
                      }}
                      onPointerUp={() => {
                        isDrawing2.current = false;
                      }}
                      onPointerCancel={() => {
                        isDrawing2.current = false;
                      }}
                      className="h-full w-full cursor-pointer"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isHandbagRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-1"
              >
                <div className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-400">
                  <Check className="h-4 w-4" />
                  <span>Sorpresa completada</span>
                </div>

                <p className="text-xs text-white/80">
                  Recuerda volver el <strong>2 de octubre</strong> para empezar tu sorpresa.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL DE CONFIRMACIÓN (¿Segura de que quieres ver el bolso?)        */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs rounded-2xl border border-pink-400/30 bg-[#160728] p-5 text-center shadow-2xl space-y-3"
            >
              <AlertTriangle className="mx-auto h-8 w-8 text-amber-300" />

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  ¿Segura de que quieres ver el bolso?
                </h3>
                <p className="text-xs text-white/75">
                  Si lo destapas ahora, verás el modelo exacto antes del día correspondiente.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setShowConfirmModal(false);
                    setStep("scratch2");
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 p-2.5 text-xs font-semibold text-white active:scale-95 transition"
                >
                  Sí, destapar bolso
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setShowConfirmModal(false);
                  }}
                  className="w-full rounded-xl border border-white/20 bg-white/5 p-2 text-xs text-white/70 active:scale-95 transition"
                >
                  Esperar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SpoilerExperience;
