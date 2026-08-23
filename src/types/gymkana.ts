import type { ComponentType } from "react";

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Índice (0-based) de la opción correcta dentro de `options`. */
  correctIndex: number;
}

export interface FriendVideo {
  name: string;
  /** Ruta dentro de /public, ej. "/videos/ana.mp4". Opcional: si falta se muestra un placeholder. */
  videoSrc?: string;
}

/**
 * Configuración de un día de la gymkana.
 * Todos los campos "day-specific" (emojiClue, letterText, quizQuestions, ...)
 * son opcionales porque cada día solo usa los que necesita su componente.
 */
export interface DayConfig {
  /** Número de día, 1-11. También se usa para mapear al componente Day{id}. */
  id: number;
  /** Fecha (YYYY-MM-DD) a partir de la cual el día se puede abrir en el calendario. */
  unlockDate: string;
  /** Título corto mostrado en la tarjeta y en la cabecera del día. */
  title: string;
  /** Emoji usado como icono de la tarjeta en el grid. */
  icon: string;
  /** Etiqueta del regalo físico asociado (ej. "Maquillaje"). Opcional. */
  giftLabel?: string;

  /** Si es true, el día muestra el formulario de contraseña genérico. */
  requiresPassword: boolean;
  /** Hash SHA-256 (hex) de la contraseña normalizada (trim + minúsculas). */
  passwordHash?: string;
  /** Placeholder del input de contraseña. */
  passwordPlaceholder?: string;

  /** Texto del acertijo / pista principal mostrado antes de desbloquear. */
  riddle: string;
  /** Pista secundaria opcional (ej. "Pide la clave a Marta por WhatsApp"). */
  hintExtra?: string;

  /** Título de la recompensa, mostrado tras desbloquear. */
  rewardTitle: string;
  /** Descripción/subtítulo de la recompensa. */
  rewardDescription?: string;

  // ---- Campos específicos por día (cada componente Day{n} usa solo los suyos) ----

  /** Día 2: pies de foto para la galería placeholder. */
  galleryCaptions?: string[];

  /** Día 3: emojis que representan la canción a adivinar. */
  emojiClue?: string;
  /** Día 3: ruta del audio en /public (ej. "/audio/day3-song.mp3"). */
  songFile?: string;
  /** Día 3: texto de la carta de amor. */
  letterText?: string;

  /** Día 4 / Día 9: ruta de la imagen sorpresa en /public. */
  imageSrc?: string;
  /** Día 4 / Día 9: pie de foto de la imagen sorpresa. */
  imageCaption?: string;
  /** Día 9: ruta del audio distorsionado con la pista para pedir la clave. */
  audioHintSrc?: string;

  /** Día 5: preguntas del quiz de pareja. */
  quizQuestions?: QuizQuestion[];
  /** Día 5: texto del vale digital que se entrega al superar el quiz. */
  voucherText?: string;

  /** Día 6: número de piezas del puzzle (se generan como 1..N). */
  puzzlePieces?: number;
  /** Día 6: pista sobre la excursión que se revela al completar el puzzle. */
  excursionHint?: string;

  /** Día 7: número de flores a animar creciendo. */
  flowerCount?: number;

  /** Día 8: mensaje que se muestra al revés y hay que leer en espejo. */
  cipherMessage?: string;
  /** Día 8: ruta del vídeo de ánimo en /public. */
  videoSrc?: string;

  /** Día 10: pista física escondida, revelada al ganar el minijuego. */
  physicalHint?: string;

  /** Día 11: vídeos/placeholders de amigos para el muro interactivo. */
  friendVideos?: FriendVideo[];
}

export interface DayComponentProps {
  config: DayConfig;
  /** true cuando el reto (contraseña, quiz, puzzle...) ya se ha superado. */
  isUnlocked: boolean;
  /** El componente del día debe llamarlo cuando el usuario supere su reto interno. */
  onUnlock: () => void;
}

export type DayComponentType = ComponentType<DayComponentProps>;
