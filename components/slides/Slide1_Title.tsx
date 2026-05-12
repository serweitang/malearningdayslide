"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Slide1_Title() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0A0C14] overflow-hidden">
      {/* Mesh grid background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated geometric lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.line
          x1="0" y1="30%" x2="100%" y2="70%"
          stroke="#E1251B" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.line
          x1="0" y1="70%" x2="100%" y2="30%"
          stroke="#E1251B" strokeWidth="0.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="50%" cy="50%" r="30%"
          stroke="#E1251B" strokeWidth="0.5" fill="none"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(225,37,27,0.08)_0%,_transparent_70%)]" />

      {/* Logo top-left */}
      <div className="absolute top-6 left-8 bg-black rounded">
        <Image
          src="/Horizontal_Asset-Black.png"
          alt="Garena"
          width={180}
          height={50}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Main text */}
      <motion.div
        className="relative z-10 text-center px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.p
          className="text-garena-red font-display text-lg tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Garena · 2026
        </motion.p>
        <h1 className="font-display font-bold text-white text-5xl md:text-7xl leading-tight tracking-tight">
          Mid Year<br />
          <span className="text-garena-red">MA</span> Learning Day
        </h1>
        <motion.div
          className="mt-6 h-0.5 bg-gradient-to-r from-transparent via-garena-red to-transparent mx-auto w-64"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </motion.div>
    </div>
  );
}
