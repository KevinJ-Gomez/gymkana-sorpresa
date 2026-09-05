import type { Metadata } from "next";
import { SpoilerExperience } from "@/components/spoiler/SpoilerExperience";

export const metadata: Metadata = {
  title: "Un adelanto especial ✨",
  description: "Un pequeño adelanto para ti antes de tiempo",
};

export default function SpoilerPage() {
  return <SpoilerExperience />;
}

