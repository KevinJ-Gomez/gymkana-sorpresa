"use client";

import { motion } from "framer-motion";
import type { DayConfig } from "@/types/gymkana";
import { isDateReached } from "@/lib/dates";
import { DayCard } from "@/components/DayCard";

export function DayGrid({
  days,
  unlockedDays,
  testingMode,
  onSelectDay,
}: {
  days: DayConfig[];
  unlockedDays: number[];
  testingMode: boolean;
  onSelectDay: (id: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-4 lg:grid-cols-4"
    >
      {days.map((day, index) => (
        <motion.div
          key={day.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.04 }}
        >
          <DayCard
            config={day}
            isAvailable={testingMode || isDateReached(day.unlockDate)}
            isSolved={unlockedDays.includes(day.id)}
            onSelect={() => onSelectDay(day.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
