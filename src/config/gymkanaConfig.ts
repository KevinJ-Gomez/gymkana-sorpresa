import type { DayConfig } from "@/types/gymkana";

/**
 * ⚙️ CONFIGURACIÓN CENTRAL DE LA GYMKANA
 * ---------------------------------------------------------------------------
 * Este es el ÚNICO archivo que deberías tocar para personalizar el contenido:
 * fechas, acertijos, contraseñas y textos. Los componentes de src/components
 * solo leen estos datos, no contienen texto "hardcodeado".
 *
 * 🔐 Contraseñas: nunca se guardan en texto plano. Genera los hashes con:
 *     node scripts/generate-hash.mjs "respuesta" "otra respuesta"
 *   y pega el resultado en `passwordHashes`. Un día admite VARIAS respuestas
 *   correctas: basta con acertar una. La entrada del usuario se normaliza
 *   (minúsculas, sin tildes, sin espacios de sobra) antes de comparar.
 *
 * 📅 Fechas: `unlockDate` usa formato "YYYY-MM-DD". Un día es visible/jugable
 *   en el grid en cuanto la fecha local del dispositivo la alcanza (o siempre,
 *   si el Modo Testing está activo).
 *
 * 🖼️ Imágenes/vídeos: coloca los ficheros dentro de /public y referencia la
 *   ruta empezando por "/", ej. "/makeup-funny.jpg".
 */

export const GYMKANA_TITLE = "11 Días de Sorpresas";
export const GYMKANA_SUBTITLE = "Una gymkana solo para ti 💌";

/** Bandera de entorno para forzar el Modo Testing por defecto (ver .env.local.example). */
export const DEFAULT_TESTING_MODE =
  process.env.NEXT_PUBLIC_TESTING_MODE === "true";

export const gymkanaConfig: DayConfig[] = [
  {
    id: 1,
    unlockDate: "2026-10-02",
    title: "El Aliado Perfecto",
    icon: "📱",
    lucideIcon: "camera",
    requiresPassword: true,
    // Respuestas válidas: "movil" e "iphone".
    passwordHashes: [
      "8dd3d0f12d706756295575bfc283da9e4ef2658cbb8531aa7261b8aed27518e5",
      "241c1e30ed886aa4a8f4248024be2ca1a221fe9773b52e2dca7891ff5771f399",
    ],
    passwordPlaceholder: "¿Qué es?",
    riddle:
      "Para capturar la magia de este viaje y que no se nos olvide nunca, vas a necesitar un buen aliado. Tiene memoria pero no cerebro, y tiene lentes pero no gafas. ¿Qué es?",
    rewardTitle: "Tu primera estrella",
    rewardDescription:
      "¡Exacto! Y para hacer las fotos que te mereces, vas a necesitar estrenar equipo. Tu primera estrella es física.\n\nPista: Está descansando a oscuras en el bolsillo pequeño de mi mochila negra. ¡Ve a buscarla!",
  },
  {
    id: 2,
    unlockDate: "2026-10-03",
    title: "El Origen de Todo",
    icon: "🗺️",
    lucideIcon: "heart",
    requiresPassword: true,
    passwordHashes: [
      "cac3c03c2529bd685c51ebc0eff22dba24902df06c6bb23cb336d637f455343b",
      "7920ee522fade9f24296c73a3487b8bccef582abac7550f541c6c31263fb94c4",
    ],
    passwordPlaceholder: "¿Dónde fue nuestra primera cita?",
    riddle:
      "Todo gran viaje tiene un punto de partida. Viajemos por un momento al pasado, justo a aquel día donde los nervios y las miradas lo decían todo. ¿Recuerdas el nombre del bar donde tuvimos nuestra primera cita a solas?",
    rewardTitle: "El comienzo",
    rewardDescription:
      "¡Correcto! Ahí en El Tuno empezó todo. Como sorpresa por acertar hoy, te he preparado algo muy especial: nuestra pequeña historia resumida en todas esas fotos que he ido guardando con muchísimo cariño durante todo este tiempo.",
  },
  {
    id: 3,
    unlockDate: "2026-10-04",
    title: "Adivina la canción",
    icon: "🎵",
    lucideIcon: "music",
    requiresPassword: true,
    passwordHashes: [
      "74a27b3ad46fa5d6500a7fcb3da10bd5315c98349c5c5154a709205ef5bd4374", // con la misma piedra
      "2df927712b42d39deaa37d3d78095b60a21a1016563d88f09b0f11e8feb7c38d", // tropece de nuevo con la misma piedra
      "741de9e562ad6b4fd735d6d77d3504885ea2ddc83e0dafdb41fedff1e7dd108a", // tropecé de nuevo con la misma piedra
      "2e0b653172239a07388e18e7b0692f8031a37094b4f1051e883455584bce52b0", // tropece de nuevo y con la misma piedra
      "744607af11c164db3c03ce5d3e33d303c6adb3b7fac937313f66fd424dc59de5", // tropecé de nuevo y con la misma piedra
      "d9a90d35fc8c622be9717be133c8f74a37ab6ae822f77f6229c7fb04966a8edc", // julio iglesias - con la misma piedra
      "c89efa0038337b349a51d9aaebdb61baa7efb184b167e920cb2350bae7447fb8", // julio iglesias con la misma piedra
    ],
    passwordPlaceholder: "¿Qué canción es?",
    riddle: "¿Qué temazo esconde esta secuencia? 🚶‍♂️💥🪨 🔄 🎶",
    rewardTitle: "Cena Romántica",
    rewardDescription:
      "¡Bingo! Ve preparando el estómago, porque tu premio de hoy es una cena romántica en un sitio muy especial... (Pronto te daré las coordenadas exactas).",
    songFile: "/audio/piedra.mp3",
  },
  {
    id: 4,
    unlockDate: "2026-10-05",
    title: "El secreto del maquillaje",
    icon: "💄",
    giftLabel: "Maquillaje",
    requiresPassword: true,
    passwordHashes: [
      "76220309bfa2825db730089f962529ad08e1ba7dc7b9d7b5304832474444eb3f",
    ],
    passwordPlaceholder: "Clave secreta",
    riddle:
      "Hoy no hay acertijo que valga: la clave la tiene una amiga tuya, y solo te la dará si se la pides con mucho cariño.",
    hintExtra: "Pista: escríbele por WhatsApp a Marta y pregúntale por \"la clave del día 4\".",
    rewardTitle: "Te espera en casa",
    rewardDescription: "Este maquillaje ya tiene dueña.",
    imageSrc: "/makeup-funny.jpg",
    imageCaption: "Sí, este es tu regalo. Ya casi lo tienes en las manos.",
  },
  {
    id: 5,
    unlockDate: "2026-10-06",
    title: "Quiz de pareja",
    icon: "❤️",
    requiresPassword: false,
    riddle: "Demuestra cuánto nos conoces. Tres preguntas, cero fallos permitidos.",
    rewardTitle: "¡Vale digital desbloqueado!",
    rewardDescription: "Canjéalo cuando quieras durante el viaje.",
    voucherText: "1 cena a elección tuya, sin mirar el precio 🍽️",
    quizQuestions: [
      {
        question: "¿Cuál fue nuestra primera cita de verdad?",
        options: ["Cine", "Cena en el italiano", "Paseo por la playa", "Concierto"],
        correctIndex: 1,
      },
      {
        question: "¿Qué serie hemos maratoneado más veces?",
        options: ["La que tú sabes", "Otra cualquiera", "Ninguna, no vemos series", "Todas por igual"],
        correctIndex: 0,
      },
      {
        question: "¿Cuál es mi excusa favorita para pedir postre?",
        options: ["\"Es para compartir\"", "\"Hoy toca\"", "\"Un día es un día\"", "Todas las anteriores"],
        correctIndex: 3,
      },
    ],
  },
  {
    id: 6,
    unlockDate: "2026-10-07",
    title: "Rompecabezas",
    icon: "🧩",
    requiresPassword: false,
    riddle: "Ordena las piezas del 1 al 6 antes de que se te acabe la paciencia.",
    rewardTitle: "Pista desbloqueada",
    rewardDescription: "Guárdala, la necesitarás en el viaje.",
    puzzlePieces: 6,
    excursionHint:
      "Busca en el pueblo el mirador con forma de corazón. Allí nos espera algo especial.",
  },
  {
    id: 7,
    unlockDate: "2026-10-08",
    title: "Su comida favorita",
    icon: "🌸",
    giftLabel: "Flores",
    requiresPassword: true,
    passwordHashes: [
      "cf98f59c0c00358277374644241def187c6ff10d7d6a61bf0eb75bd4476344a3",
    ],
    passwordPlaceholder: "¿Cuál es tu plato favorito?",
    riddle: "¿Cuál es esa comida que pides sin dudar cada vez que te dejo elegir restaurante?",
    rewardTitle: "Para ti",
    rewardDescription: "Las flores de verdad ya están de camino.",
    flowerCount: 5,
  },
  {
    id: 8,
    unlockDate: "2026-10-09",
    title: "Mensaje cifrado",
    icon: "🔐",
    requiresPassword: false,
    riddle: "Este mensaje viene al revés. Léelo con calma... o dale al botón para descifrarlo.",
    rewardTitle: "Un amigo quiere decirte algo",
    rewardDescription: "Sube el volumen.",
    cipherMessage:
      "adaz se azilaner al ,adan se elisopmi al euq odacas etsE .zulf ed anell átse adiv ut euq y ,zecilef sáes euq oseed etnemlaeR",
    videoSrc: "/videos/day8-animo.mp4",
  },
  {
    id: 9,
    unlockDate: "2026-10-10",
    title: "Audio distorsionado",
    icon: "🎧",
    giftLabel: "Bolso",
    requiresPassword: true,
    passwordHashes: [
      "fb1d2d7b10245525cb347e3e38ebc07f27335972d20555a737847640c10c74a6",
    ],
    passwordPlaceholder: "Clave secreta",
    riddle: "Escucha el audio si te atreves. Vas a necesitar ayuda para entenderlo.",
    hintExtra: "Pista: Dani tiene la clave. Mándale un audio pidiéndosela (spoiler: se reirá de ti).",
    audioHintSrc: "/audio/day9-distorted.mp3",
    rewardTitle: "Alta costura, nivel experto",
    rewardDescription: "Preparada para posar con tu bolso nuevo.",
    imageSrc: "/bag-funny.jpg",
    imageCaption: "La modelo ya tiene complemento.",
  },
  {
    id: 10,
    unlockDate: "2026-10-11",
    title: "Encuentra el corazón",
    icon: "🎮",
    requiresPassword: false,
    riddle: "Entre tantas estrellas se esconde un corazón. Encuéntralo antes de que se mueva.",
    rewardTitle: "Pista física desbloqueada",
    rewardDescription: "Hay algo escondido esperándote en el viaje.",
    physicalHint:
      "Revisa el bolsillo delantero de la maleta pequeña. No, el de verdad, no el de broma.",
  },
  {
    id: 11,
    unlockDate: "2026-10-12",
    title: "¡Feliz cumpleaños!",
    icon: "🎂",
    requiresPassword: false,
    riddle: "",
    rewardTitle: "Hoy es tu día",
    rewardDescription:
      "Once días de retos y esto es solo el principio. Todos los que te quieren tienen algo que decirte.",
    friendVideos: [
      { name: "Marta" },
      { name: "Dani" },
      { name: "Lucía" },
      { name: "Tus padres" },
    ],
  },
];

/** Acceso rápido a la config de un día por id. */
export function getDayConfig(id: number): DayConfig | undefined {
  return gymkanaConfig.find((day) => day.id === id);
}
