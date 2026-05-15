"use client";

import { motion } from "framer-motion";
import { AuroraBeams } from "@/components/ui/AuroraBeams";

export function Slide12_ThankYou() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0A0C14] overflow-hidden">
      {/* Animated radial gradient pulse */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at center, rgba(225,37,27,0.06) 0%, transparent 70%)",
            "radial-gradient(ellipse at center, rgba(225,37,27,0.12) 0%, transparent 60%)",
            "radial-gradient(ellipse at center, rgba(225,37,27,0.06) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <AuroraBeams />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="font-display font-bold text-white tracking-tight"
          style={{ fontSize: "11rem" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Thank <span className="text-garena-red">You</span>
        </motion.h1>

        <motion.div
          className="h-0.5 bg-gradient-to-r from-transparent via-garena-red to-transparent w-96"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        <motion.p
          className="text-white/40 font-body tracking-widest"
          style={{ fontSize: "1.75rem" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          2026 Mid Year MA Learning Day · Garena
        </motion.p>

      </motion.div>
    </div>
  );
}
