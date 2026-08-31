"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Heart,
  HelpCircle,
  MessageCircle,
  Smile,
} from "lucide-react";
import type { DayComponentProps } from "@/types/gymkana";
import { ScratchPhotoCard } from "@/components/effects/ScratchPhotoCard";
import { hapticSuccess, hapticError, hapticTap } from "@/lib/haptics";

// =========================================================================
// HASHES SHA-256 DE LAS 3 CERRADURAS
// =========================================================================

// 1. Pregunta Madre (Suegra): "¿Qué palabra uso para llamarte a ti o referirme a ti cuando te hablo?"
// Respuestas: "cuñis", "cunis", "la cuñis", "mi cuñis"
const HASHES_MADRE = [
  "0618057f86727e79a7480a1d4d30945b3eb8c3abf064b6d03c61ba0c255a0ab4", // cuñis
  "e7c5f3e7e99811235e798d5699725bb01b1d010fd04144dcfe83a7903876f6da", // cunis
  "bcd50b7d9ddc032602fbe52830bb8fe97c620a6ce4ea46b4b140732d29dfd57d", // la cuñis
  "5b95d9410e19de26cd3380eb3ec9d273013a50b383e39257c1d476a72641d3a7", // mi cuñis
];

// 2. Pregunta Hermana (Cuñada): "¿En qué mes y día es mi cumpleaños?"
// Respuestas: "2501", "25 de enero", "25/01", "25/1", "25 enero", "enero", "1", "01", "el 25 de enero"
const HASHES_HERMANA = [
  "dafff407d7450f62b0dd0c413f9f0745d70071b8ba4d731d093804be0502184e", // 2501
  "d6949710c26b61b4224f8c95acc883a9040f1fc26eed3798b447d6972dd19be4", // 25 de enero
  "0f2625bdb5537721d2af67b7b77f7a6ec52547b4ee78cb80b63c130831eba156", // 25/01
  "cfefdd24b01a657f089194c565b30e35c104150b3434d03f2ba28ef2324befc4", // 25/1
  "98fd1750ecaf847fd83cac07011829b874aef991267aaf5d365057879af795ff", // 25 enero
  "0710eab930e02ed7ad600a7ba9c0a6ebe3c0823517a506780c6fe124f1330c48", // enero
  "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", // 1
  "938db8c9f82c8cb58d3f3ef4fd250036a48d26a712753d2fde5abd03a85cabf4", // 01
  "a9e91bec3bf63f75b87beb1fbc6b59f7cedb013d448f6d0283e615af3819a604", // el 25 de enero
  "bb572095ec1b6c985becf84888659ff91926f4d3df879e23f2ed10ddbb2ada72", // veinticinco de enero
];

// 3. Pregunta Novio: "¿Cuál es el nombre de mi película favorita?"
// Respuestas: "el señor de los anillos", "lord of the rings", "esdla", "la comunidad del anillo", etc.
const HASHES_NOVIO = [
  "e4566f399dafdff26d2cc3d18cfbb4a3ae99dbbe155690be31efcf0082d3d590", // el señor de los anillos
  "bec9e36842221cfc318c46c281727b001d9108a7f41c48e94e1463186e34f341", // el senor de los anillos
  "67c624855407481a6f14da6e54e2853fa8023f38c2d4d8fb2c495c685333c651", // señor de los anillos
  "56c16230c8d52e55efa09992df2c3e6fe9f920c3a87de0e51321b354ace07bb3", // senor de los anillos
  "529c5b7ac1d02079fc162a4fe3e32a020057f4b3d7b6225eb55bf8ec65257282", // lord of the rings
  "724be89d8dd19e5dc3d7eab88cc7c094920b5e762a8c494479a3ab95c41eaf6a", // esdla
  "f3bf65f4dac758bd558b4dde181f3beecac30e0aee1f52caa8bc4c23bf34d926", // lotr
  "fdf44570d6014a147bbc7baab1746add77ab77a4f2d8080d12a6bf04c91ccfe0", // la comunidad del anillo
  "a8712cae485d66471a9f123dfaf2cc4d3a6f77a8c3b6588f4bd6704203ee75e8", // las dos torres
  "f7cbf0cc69fd11089df49836819e72ee5962b91a4a980503be859906ed1889c5", // el retorno del rey
  "63ded88b30b63e2f16b633c033413d94f5433940d790836308e2dd0719ba886b", // el señor de los anillos: la comunidad del anillo
  "18537fdb5e0b109ef3dd56f09157bf7b60af9d7bc8e7a824056675f501549790", // el señor de los anillos: las dos torres
  "6ed0276a062d8734e88931d24aa057c24db2bf3d208a1129f93bbbf43bc6a9e6", // el señor de los anillos: el retorno del rey
  "57c1f5092ac5ea62c089bf89e069cf5cb91eca57d6175f1304a0e97a828bbd3c", // el senor de los anillos: la comunidad del anillo
  "c634f8a6aa4138e22c5273c5cd13bc73678d9a065b922bdd6ecbaf2ebc82ca2a", // el senor de los anillos: las dos torres
  "d0f3e940860027b229819e70e6db853bcfe37c9477e041558b0efb7f4ff618a4", // el senor de los anillos: el retorno del rey
  "07d40a084cdf34f5ac66e3bca170787053bf03d3baeab7ad7db2734d2d5a9dcd", // el señor de los anillos la comunidad del anillo
  "54fcfb370929c48b754e3c299c8e5c569d6e6e188952ea0567ed76b35a87434a", // el señor de los anillos las dos torres
  "a758d65c86b448c802fde453f9c4ba6c7d6eba4636187c2b1d7a47a2957e68bc", // el señor de los anillos el retorno del rey
];

async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Frase comprometida y divertida de agente secreto SIN revelar el bolso
const EMBARRASSING_PHRASE =
  "Operación Secreta: Hola, soy un flamenco encubierto buscando su corona de plumas y solicito formalmente mi clave de acceso 🦩👑";

/**
 * Día 8: El Candado de los 3 Cómplices (Madre, Hermana, Novio).
 */
export function Day8({ config, isUnlocked, onUnlock }: DayComponentProps) {
  const [unlocked1, setUnlocked1] = useState(false);
  const [unlocked2, setUnlocked2] = useState(false);
  const [unlocked3, setUnlocked3] = useState(false);

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [error3, setError3] = useState(false);

  const [copiedPhrase, setCopiedPhrase] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(EMBARRASSING_PHRASE);
    setCopiedPhrase(true);
    setTimeout(() => setCopiedPhrase(false), 2500);
  };

  const handleVerify1 = async () => {
    if (!input1.trim()) return;
    const h = await sha256Hex(input1);
    if (HASHES_MADRE.includes(h)) {
      setError1(false);
      setUnlocked1(true);
      checkAllUnlocked(true, unlocked2, unlocked3);
    } else {
      setError1(true);
    }
  };

  const handleVerify2 = async () => {
    if (!input2.trim()) return;
    const h = await sha256Hex(input2);
    if (HASHES_HERMANA.includes(h)) {
      setError2(false);
      setUnlocked2(true);
      checkAllUnlocked(unlocked1, true, unlocked3);
    } else {
      setError2(true);
    }
  };

  const handleVerify3 = async () => {
    if (!input3.trim()) return;
    const h = await sha256Hex(input3);
    if (HASHES_NOVIO.includes(h)) {
      setError3(false);
      setUnlocked3(true);
      checkAllUnlocked(unlocked1, unlocked2, true);
    } else {
      setError3(true);
    }
  };

  const checkAllUnlocked = (u1: boolean, u2: boolean, u3: boolean) => {
    if (u1 && u2 && u3 && !isUnlocked) {
      startTransition(() => {
        onUnlock?.();
      });
    }
  };

  const unlockedCount = (unlocked1 ? 1 : 0) + (unlocked2 ? 1 : 0) + (unlocked3 ? 1 : 0);
  const isFullyUnlocked = isUnlocked || unlockedCount === 3;

  // =========================================================================
  // PANTALLA DE RECOMPENSA: EL REGALO DESBLOQUEADO CON FOTO
  // =========================================================================
  if (isFullyUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-pink-400/30 bg-gradient-to-b from-[#2a0e36] via-[#1a0724] to-[#0c0312] p-6 sm:p-7 text-center shadow-2xl space-y-5"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-300 backdrop-blur-md">
          <Sparkles className="h-4 w-4" />
          <span>¡Candado 100% Abierto!</span>
          <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow">
            {config.rewardTitle}
          </h3>
          <p className="text-xs sm:text-sm text-pink-200/90 font-mono tracking-wide">
            SEGUNDO REGALO DE LA FAMILIA
          </p>
        </div>

        {/* TARJETA INTERACTIVA DE RASCAR PARA DESVELAR EL BOLSO */}
        <ScratchPhotoCard
          imageSrc={config.imageSrc || "/images/day8-bolso.jpg"}
          altText="Tu nuevo bolso te espera"
        />

        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5 text-left backdrop-blur-md space-y-2.5">
          <p className="text-xs sm:text-sm leading-relaxed text-white/95 font-serif italic">
            “Has descifrado a los 3 cómplices y has abierto las 3 cerraduras secretas.”
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Tu suegra, tu cuñada y tu novio han elegido con todo su cariño un <strong>bolso espectacular</strong> para ti. ¡Pregúntales ahora mismo la pista definitiva de dónde lo tienen guardado! ✨
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-pink-300 text-xs font-serif italic">
          <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
          <span>Con todo el amor de tu familia política y tu novio</span>
          <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
        </div>
      </motion.div>
    );
  }

  // =========================================================================
  // PANTALLA PRINCIPAL: EL RETO DEL CANDADO Y LOS 3 CÓMPLICES
  // =========================================================================
  return (
    <div className="space-y-6 text-center select-none">
      {/* CABECERA VISUAL DEL CANDADO */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#250d32] via-[#160620] to-[#0d0314] p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              El Candado de los 3 Cómplices
            </h3>
            <p className="text-xs text-pink-300/90 font-mono">
              Cerraduras abiertas: {unlockedCount} / 3
            </p>
          </div>
        </div>

        {/* Barra de progreso de las 3 cerraduras */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              unlocked1 ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-white/15"
            }`}
          />
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              unlocked2 ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-white/15"
            }`}
          />
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              unlocked3 ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-white/15"
            }`}
          />
        </div>
      </div>

      {/* ADVERTENCIA Y FRASE COMPROMETIDA */}
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-left backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Instrucciones de la Misión</span>
        </div>
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
          Para abrir cada cerradura, lee atentamente el acertijo de cada cómplice. Si crees saber quién es esa persona, <strong>arriésgate a enviarle exactamente esta frase por WhatsApp</strong> para que te haga su pregunta secreta:
        </p>
        <p className="text-[11px] text-amber-200/80 italic">
          (Cuidado: si te equivocas de persona, habrás hecho el ridículo más absoluto enviándole este mensaje sin sentido 🦩👑).
        </p>

        {/* Caja para copiar la frase clave */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-black/40 p-3.5 text-xs text-amber-200">
          <p className="font-mono italic select-all leading-relaxed text-[11px] sm:text-xs">
            “{EMBARRASSING_PHRASE}”
          </p>
          <button
            type="button"
            onClick={handleCopyPhrase}
            className="flex shrink-0 items-center gap-1 rounded-xl bg-amber-400/20 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/30 active:scale-95"
          >
            {copiedPhrase ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LAS 3 CERRADURAS CON SUS ACERTIJOS (ORDEN INVERTIDO: 1. MADRE, 2. HERMANA, 3. NOVIO) */}
      <div className="space-y-4">
        {/* ================================================================= */}
        {/* 1ª CERRADURA: LA MADRE (SUEGRA) */}
        {/* ================================================================= */}
        <motion.div
          className={`rounded-3xl border p-5 text-left transition-all ${
            unlocked1
              ? "border-emerald-400/40 bg-emerald-950/30 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
              : "border-white/15 bg-white/5"
          }`}
        >
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300 font-mono">
                1
              </span>
              <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                1ª Cerradura · El Primer Cómplice
              </h4>
            </div>
            {unlocked1 ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Abierta</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Lock className="h-4 w-4" />
                <span>Bloqueada</span>
              </span>
            )}
          </div>

          {!unlocked1 ? (
            <div className="space-y-3">
              {/* Acertijo para deducir quién es */}
              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-3.5 text-xs text-pink-100/90 leading-relaxed font-serif italic">
                “Cocina con amor insuperable, crió al chico de tus ojos y hoy te cuida y te quiere como a una hija más. En esta familia su palabra es ley... ¿Quién tiene tu primera clave?”
              </div>

              <p className="text-[11px] text-white/70 leading-relaxed">
                Si crees saber quién es, mándale la frase por WhatsApp. Te responderá con una pregunta secreta cuya respuesta abre esta cerradura:
              </p>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input1}
                    onChange={(e) => {
                      setInput1(e.target.value);
                      setError1(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify1()}
                    placeholder="Introduce la respuesta a su pregunta..."
                    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-pink-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerify1}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md active:scale-95 transition"
                  >
                    Probar
                  </button>
                </div>
                {error1 && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Respuesta incorrecta. Revisa bien lo que te ha preguntado o si le has escrito a la persona correcta.</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-300 font-medium">
              ✨ ¡1ª Cerradura superada con éxito!
            </p>
          )}
        </motion.div>

        {/* ================================================================= */}
        {/* 2ª CERRADURA: LA HERMANA (CUÑADA) */}
        {/* ================================================================= */}
        <motion.div
          className={`rounded-3xl border p-5 text-left transition-all ${
            unlocked2
              ? "border-emerald-400/40 bg-emerald-950/30 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
              : "border-white/15 bg-white/5"
          }`}
        >
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300 font-mono">
                2
              </span>
              <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                2ª Cerradura · El Segundo Cómplice
              </h4>
            </div>
            {unlocked2 ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Abierta</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Lock className="h-4 w-4" />
                <span>Bloqueada</span>
              </span>
            )}
          </div>

          {!unlocked2 ? (
            <div className="space-y-3">
              {/* Acertijo para deducir quién es */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-3.5 text-xs text-purple-100/90 leading-relaxed font-serif italic">
                “No comparto tu sangre, pero comparto la infancia y los secretos del hombre que amas. Su madre es mi madre, su casa fue mi casa y hoy somos cómplices... ¿Quién soy?”
              </div>

              <p className="text-[11px] text-white/70 leading-relaxed">
                Si crees saber quién es, mándale la frase por WhatsApp y supera su pregunta secreta:
              </p>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input2}
                    onChange={(e) => {
                      setInput2(e.target.value);
                      setError2(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify2()}
                    placeholder="Introduce la respuesta a su pregunta..."
                    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerify2}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md active:scale-95 transition"
                  >
                    Probar
                  </button>
                </div>
                {error2 && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Respuesta incorrecta. Pídele que te repita la pregunta o revisa la fecha/mes.</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-300 font-medium">
              ✨ ¡2ª Cerradura superada con éxito!
            </p>
          )}
        </motion.div>

        {/* ================================================================= */}
        {/* 3ª CERRADURA: EL NOVIO (TÚ) */}
        {/* ================================================================= */}
        <motion.div
          className={`rounded-3xl border p-5 text-left transition-all ${
            unlocked3
              ? "border-emerald-400/40 bg-emerald-950/30 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
              : "border-white/15 bg-white/5"
          }`}
        >
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 font-mono">
                3
              </span>
              <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                3ª Cerradura · El Tercer Cómplice
              </h4>
            </div>
            {unlocked3 ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Abierta</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Lock className="h-4 w-4" />
                <span>Bloqueada</span>
              </span>
            )}
          </div>

          {!unlocked3 ? (
            <div className="space-y-3">
              {/* Acertijo para deducir quién es */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-100/90 leading-relaxed font-serif italic">
                “Comparto tu almohada, tus viajes y tus risas. Fui tu compañero antes de ser tu compañero de vida, y hoy soy quien más te ama en este universo... ¿Quién tiene tu última llave?”
              </div>

              <p className="text-[11px] text-white/70 leading-relaxed">
                Si crees saber quién es, mándale la frase por WhatsApp y acierta su película favorita:
              </p>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input3}
                    onChange={(e) => {
                      setInput3(e.target.value);
                      setError3(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify3()}
                    placeholder="Introduce la respuesta a su pregunta..."
                    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerify3}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md active:scale-95 transition"
                  >
                    Probar
                  </button>
                </div>
                {error3 && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Respuesta incorrecta. Piensa bien en sus sagas y películas de cabecera.</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-300 font-medium">
              ✨ ¡3ª Cerradura superada con éxito!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Day8;
