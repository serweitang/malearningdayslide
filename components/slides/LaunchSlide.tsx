"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";

interface Props {
  presenterName: string;
  url: string;
  autoAdvanceSeconds?: number; // starts counting down when you return to this tab after launching
}

export function LaunchSlide({ presenterName, url, autoAdvanceSeconds }: Props) {
  const nextSlide = useAppStore((s) => s.nextSlide);
  const [launched, setLaunched] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Tick the countdown down every second
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      nextSlide();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, nextSlide]);

  function handleLaunch() {
    setLaunched(true);
if (autoAdvanceSeconds) setCountdown(autoAdvanceSeconds);
  }

  const circumference = 2 * Math.PI * 36; // r=36
  const progress = autoAdvanceSeconds && countdown !== null
    ? (countdown / autoAdvanceSeconds) * circumference
    : circumference;

  return (
    <div className="relative w-full h-full bg-[#0A0C14] flex flex-col items-center justify-center overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Red glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(224, 0, 27, 0.1) 0%, transparent 65%)" }}
      />

      {/* Left edge accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-garena-red via-garena-red/50 to-transparent" />

      <motion.p
        className="font-mono-tech text-garena-red tracking-[0.25em] uppercase mb-6 relative z-10"
        style={{ fontSize: "1.4rem" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Presentation
      </motion.p>

      <motion.h2
        className="font-display font-bold text-white mb-10 relative z-10"
        style={{ fontSize: "5rem" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {presenterName}
      </motion.h2>

      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleLaunch}
        className="relative z-10 flex items-center gap-4 font-mono-tech text-white uppercase tracking-widest"
        style={{
          fontSize: "1.4rem",
          padding: "20px 48px",
          background: "#e0001b",
          borderRadius: "4px",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Open Presentation
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </motion.a>

      {/* Countdown ring — appears after returning to tab */}
      {countdown !== null && (
        <motion.div
          className="relative z-10 flex flex-col items-center mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle
                cx="48" cy="48" r="36"
                fill="none"
                stroke="#e0001b"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="font-display font-bold text-white" style={{ fontSize: "2rem" }}>
              {countdown}
            </span>
          </div>
          <p className="font-mono-tech text-white/40 mt-3 tracking-widest uppercase" style={{ fontSize: "0.9rem" }}>
            Next up: advancing automatically
          </p>
        </motion.div>
      )}

    </div>
  );
}
