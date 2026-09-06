"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_UNLOCK = new Date("2026-10-02T00:00:00+02:00").getTime();
const TARGET_BIRTHDAY = new Date("2026-10-12T00:00:00+02:00").getTime();

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeDiff(target: number): TimeUnits {
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

interface LockedScreenProps {
  onSecretTap: () => void;
  toast: string | null;
}

export function LockedScreen({ onSecretTap, toast }: LockedScreenProps) {
  const [unlockTime, setUnlockTime] = useState<TimeUnits>(() => getTimeDiff(TARGET_UNLOCK));
  const [birthdayTime, setBirthdayTime] = useState<TimeUnits>(() => getTimeDiff(TARGET_BIRTHDAY));

  useEffect(() => {
    const interval = setInterval(() => {
      setUnlockTime(getTimeDiff(TARGET_UNLOCK));
      setBirthdayTime(getTimeDiff(TARGET_BIRTHDAY));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="invitation">
      <AnimatePresence>
        {toast && (
          <motion.aside role="status" aria-live="polite"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="invitation-toast">{toast}</motion.aside>
        )}
      </AnimatePresence>
      <div className="invitation-paper">
        <div className="invitation-dateline" aria-hidden="true"><span>02 OCT</span><span>—</span><span>12 OCT</span></div>
        <div className="sealed-letter" aria-hidden="true">
          <div className="letter-insert" />
          <div className="letter-envelope" />
          <span className="letter-seal">11</span>
        </div>
        <h1 className="invitation-title"><button type="button" onClick={onSecretTap}>Bloqueada</button></h1>
        <p className="invitation-subtitle">Vuelve el día 2 de octubre</p>
        <div className="invitation-rule" aria-hidden="true" />
        {[
          { title: "Desbloqueo de la web", date: "2 OCT", time: unlockTime },
          { title: "Tu cumpleaños", date: "12 OCT", time: birthdayTime },
        ].map(({ title, date, time }) => (
          <section className="invitation-countdown" key={title} aria-label={title}>
            <div className="countdown-heading"><h2>{title}</h2><span>{date}</span></div>
            <div className="countdown-units">
              {[
                [time.days, "Días"], [time.hours, "Horas"],
                [time.minutes, "Min"], [time.seconds, "Seg"],
              ].map(([value, label]) => (
                <div key={label}><span className="countdown-number" suppressHydrationWarning>{String(value).padStart(2, "0")}</span><span className="countdown-label">{label}</span></div>
              ))}
            </div>
          </section>
        ))}
        <div className="invitation-endmark" aria-hidden="true">· &nbsp; · &nbsp; ·</div>
      </div>
    </main>
  );
}

export default LockedScreen;
