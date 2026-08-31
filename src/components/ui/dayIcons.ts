import {
  Cake,
  Camera,
  Flower2,
  Gamepad2,
  Gift,
  Headphones,
  Heart,
  Lock,
  Map,
  Music,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import type { DayIconName } from "@/types/gymkana";

/** Mapa nombre → componente para el campo `lucideIcon` de cada día. */
export const DAY_ICONS: Record<DayIconName, LucideIcon> = {
  camera: Camera,
  gift: Gift,
  map: Map,
  music: Music,
  sparkles: Heart,
  heart: Heart,
  puzzle: Puzzle,
  flower: Flower2,
  lock: Lock,
  headphones: Headphones,
  gamepad: Gamepad2,
  cake: Cake,
};
