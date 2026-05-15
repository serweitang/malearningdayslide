"use client";

import { motion } from "framer-motion";

/*
  HOW THIS WORKS — not blobs, but horizontal ribbons:

  Each ribbon is a very wide (350% of parent) short div with a linear-gradient
  that has MULTIPLE opacity peaks spread across its width. As the ribbon
  translates horizontally, different peaks drift across the visible window —
  this is what creates the aurora curtain / wave look rather than blobs.

  Stacking several ribbons at slightly different vertical positions, each
  moving at a different speed and direction, produces the rippling depth
  of real northern lights.
*/

function AuroraRibbon({
  top,
  height,
  gradient,
  blur,
  duration,
  delay,
  xWave,
  yWave,
  skewRange,
  opacityWave,
}: {
  top: string;
  height: string;
  gradient: string;
  blur?: string;
  duration: number;
  delay: number;
  xWave: number[];
  yWave: number[];
  skewRange: number[];
  opacityWave: number[];
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        // wide enough that peaks always fill the visible window
        width: "350%",
        height,
        top,
        // centre the oversized ribbon so we can shift either direction
        left: "-125%",
        background: gradient,
        filter: `blur(${blur ?? "38px"})`,
      }}
      animate={{
        x: xWave,
        y: yWave,
        skewX: skewRange,
        opacity: opacityWave,
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
        times: xWave.map((_, i) => i / (xWave.length - 1)),
      }}
    />
  );
}

// Multi-peak gradient helpers — peaks spread across the ribbon width
// so that as it translates, different peaks sweep through the visible area
const RED_RIBBON =
  "linear-gradient(to right, transparent 0%, rgba(225,37,27,0.55) 10%, transparent 20%, rgba(200,15,22,0.45) 32%, transparent 44%, rgba(240,50,35,0.50) 56%, transparent 68%, rgba(210,20,25,0.42) 80%, transparent 90%, rgba(225,37,27,0.35) 98%, transparent 100%)";

const CRIMSON_RIBBON =
  "linear-gradient(to right, rgba(180,8,18,0.40) 0%, transparent 12%, rgba(225,37,27,0.48) 25%, transparent 38%, rgba(190,12,20,0.38) 52%, transparent 64%, rgba(230,40,30,0.44) 76%, transparent 88%, rgba(185,10,20,0.36) 100%)";

const WARM_RIBBON =
  "linear-gradient(to right, transparent 5%, rgba(255,55,38,0.42) 18%, transparent 30%, rgba(235,38,28,0.36) 45%, transparent 58%, rgba(255,60,40,0.40) 72%, transparent 84%, rgba(220,30,25,0.30) 96%, transparent 100%)";

const SILVER_RIBBON =
  "linear-gradient(to right, transparent 0%, rgba(215,218,228,0.14) 14%, transparent 28%, rgba(205,210,222,0.10) 45%, transparent 60%, rgba(218,220,230,0.12) 75%, transparent 88%, rgba(210,215,225,0.09) 100%)";

const FAINT_RED =
  "linear-gradient(to right, rgba(200,15,20,0.22) 0%, transparent 18%, rgba(225,37,27,0.28) 35%, transparent 52%, rgba(195,12,18,0.20) 68%, transparent 82%, rgba(220,30,25,0.24) 100%)";

export function AuroraBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* ── LAYER 1: topmost bright ribbon, moves fast left → right ── */}
      <AuroraRibbon
        top="-30px" height="140px"
        gradient={RED_RIBBON} blur="30px"
        duration={9} delay={0}
        xWave={[0, 260, 520, 340, 100, -180, -400, -200, 0]}
        yWave={[0, 10, -8, 15, 5, -12, 3, -6, 0]}
        skewRange={[0, 2, -1, 3, 1, -2, 0, 1, 0]}
        opacityWave={[0.75, 1, 0.65, 0.9, 0.55, 0.85, 0.5, 0.8, 0.75]}
      />

      {/* ── LAYER 2: second ribbon, drifts the other way, offset ──── */}
      <AuroraRibbon
        top="60px" height="160px"
        gradient={CRIMSON_RIBBON} blur="42px"
        duration={13} delay={1.5}
        xWave={[0, -300, -560, -320, -60, 200, 440, 220, 0]}
        yWave={[0, 18, 6, -10, 20, 4, -14, 8, 0]}
        skewRange={[0, -3, 1, -2, 0, 3, -1, 2, 0]}
        opacityWave={[0.65, 0.55, 0.9, 0.6, 0.95, 0.5, 0.8, 0.45, 0.65]}
      />

      {/* ── LAYER 3: wider, softer, slower — creates mid-band depth ── */}
      <AuroraRibbon
        top="140px" height="180px"
        gradient={WARM_RIBBON} blur="55px"
        duration={17} delay={0.7}
        xWave={[0, 200, 420, 180, -100, -320, -150, 80, 0]}
        yWave={[0, -12, 20, 8, -18, 12, -6, 16, 0]}
        skewRange={[0, 1, -2, 2, -1, 3, 0, -1, 0]}
        opacityWave={[0.6, 0.85, 0.45, 0.8, 0.55, 0.9, 0.4, 0.75, 0.6]}
      />

      {/* ── LAYER 4: silver shimmer woven through the red ─────────── */}
      <AuroraRibbon
        top="30px" height="200px"
        gradient={SILVER_RIBBON} blur="50px"
        duration={20} delay={3}
        xWave={[0, 350, 180, -100, -380, -200, 120, 0]}
        yWave={[0, 8, -15, 20, 5, -18, 10, 0]}
        skewRange={[0, 2, -1, 3, -2, 1, -1, 0]}
        opacityWave={[0.55, 0.8, 0.35, 0.7, 0.45, 0.75, 0.3, 0.55]}
      />

      {/* ── LAYER 5: lower fade — aurora trailing off downward ─────── */}
      <AuroraRibbon
        top="260px" height="200px"
        gradient={FAINT_RED} blur="70px"
        duration={22} delay={2}
        xWave={[0, -250, -100, 180, 360, 150, -80, 0]}
        yWave={[0, 20, -10, 15, -20, 8, -12, 0]}
        skewRange={[0, -1, 2, -2, 1, -3, 1, 0]}
        opacityWave={[0.45, 0.65, 0.3, 0.55, 0.4, 0.7, 0.25, 0.45]}
      />

      {/* ── BASE GLOW: soft radial behind everything ──────────────── */}
      <motion.div
        style={{
          position: "absolute",
          width: "100%", height: "45%",
          top: 0, left: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(225,37,27,0.18) 0%, rgba(180,15,20,0.08) 50%, transparent 80%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.7, 1, 0.5, 0.85, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

    </div>
  );
}
