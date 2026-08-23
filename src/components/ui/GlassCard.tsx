"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
