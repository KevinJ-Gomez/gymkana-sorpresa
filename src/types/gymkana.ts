import type { ComponentType } from "react";

/**
 * Iconos disponibles para la cabecera de un día. Es una lista cerrada a
 * propósito: así el config no puede referirse a un icono que no existe y el
 * bundle solo incluye los que se usan de verdad.
 * El mapa nombre → componente vive en `src/components/ui/dayIcons.ts`.
 */
export type DayIconName =
  | "camera"
  | "gift"
  | "map"
  | "music"
  | "sparkles"
  | "heart"
  | "puzzle"
  | "flower"
  | "lock"
  | "headphones"
  | "gamepad"
  | "cake";

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Índice (0-based) de la opción correcta dentro de `options`. */
  correctIndex?: number;
  /** Si hay varias opciones correctas (o todas). */
  correctIndices?: number[];
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
  /**
   * Emoji del día. Se usaba en el grid 2D original; desde el rediseño 3D no se
   * pinta en ningún sitio. Se conserva por si vuelve a hacer falta.
   */
  icon: string;
  /** Icono (lucide-react) mostrado en la cabecera de la tarjeta del día. */
  lucideIcon?: DayIconName;
  /** Etiqueta del regalo físico asociado (ej. "Maquillaje"). Opcional. */
  giftLabel?: string;

  /** Si es true, el día muestra el formulario de contraseña genérico. */
  requiresPassword: boolean;
  /**
   * Hashes SHA-256 (hex) de las respuestas válidas, ya normalizadas.
   *
   * Es una LISTA porque un mismo acertijo puede tener varias respuestas buenas
   * ("movil", "iphone", "telefono"): basta acertar una. Genéralos con
   * `node scripts/generate-hash.mjs "movil" "iphone"`.
   */
  passwordHashes?: string[];
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
