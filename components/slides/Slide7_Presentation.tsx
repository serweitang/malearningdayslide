"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getPhotoUrl, supabase } from "@/lib/supabase";

interface Props {
  presenter: string;
  rotationTitle: string;
  rotationNumber: string;
  maPhotoPath: string | null;
  maId: number;
}

const BG = "#0A0C14";

const EXT_FALLBACKS: Record<string, string> = { ".jpg": ".jpeg", ".jpeg": ".png", ".png": ".jpg" };
function nextSrc(url: string): string | null {
  for (const [ext, next] of Object.entries(EXT_FALLBACKS)) {
    if (url.endsWith(ext)) return url.slice(0, -ext.length) + next;
  }
  return null;
}

function PhotoBackground({ url, presenter }: { url: string | null; presenter: string }) {
  const [src, setSrc] = useState(url);
  const [failed, setFailed] = useState(false);
  const initials = presenter.split(" ").map((w) => w[0]).slice(0, 2).join("");

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-garena-red/10 to-transparent">
        <span
          className="text-white/10 font-display font-bold"
          style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={presenter}
      fill
      quality={100}
      sizes="50vw"
      className="object-cover object-top"
      onError={() => {
        const alt = nextSrc(src);
        if (alt) { setSrc(alt); } else { setFailed(true); }
      }}
    />
  );
}

export function PresentationSlide({ presenter, rotationTitle, rotationNumber, maPhotoPath, maId }: Props) {
  const photoUrl = getPhotoUrl(maPhotoPath);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("ma_profiles")
      .select("tags")
      .eq("id", maId)
      .single()
      .then(({ data }) => {
        if (data?.tags) setTags(data.tags);
      });
  }, [maId]);

  return (
    <div className="relative w-full h-full bg-[#0A0C14] flex overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow behind left panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(224, 0, 27, 0.12) 0%, transparent 65%)" }}
      />

      {/* Left edge accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-garena-red via-garena-red/50 to-transparent" />

      {/* Full right-half photo — absolute, behind text layer */}
      <motion.div
        className="absolute top-0 right-0 z-[5]"
        style={{ width: "50%", height: "100%", minWidth: "45vw" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <PhotoBackground url={photoUrl} presenter={presenter} />

        {/* Multi-edge fade overlay — dissolves photo into background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              `linear-gradient(to right,  ${BG} 0%, transparent 35%)`,
              `linear-gradient(to bottom, ${BG} 0%, transparent 20%)`,
              `linear-gradient(to top,    ${BG} 0%, transparent 20%)`,
              `linear-gradient(to left,   ${BG} 0%, transparent 15%)`,
            ].join(", "),
          }}
        />
      </motion.div>

      {/* Left panel — text content (sits above photo via z-10) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-16 py-12">

        {/* Rotation label */}
        <motion.p
          className="font-mono-tech text-garena-red text-sm tracking-[0.25em] uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
        >
          {rotationNumber} Rotation · Presentation
        </motion.p>

        {/* Name */}
        <motion.h2
          className="font-display font-bold text-white text-5xl md:text-6xl leading-tight mb-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          {presenter}
        </motion.h2>

        {/* Extended red underline */}
        <motion.div
          className="w-[45%] mb-6"
          style={{
            height: "1px",
            background: "linear-gradient(to right, #e0001b 0%, rgba(224,0,27,0.15) 60%, transparent 100%)",
            transformOrigin: "left",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        />

        {/* Department / rotation title */}
        <motion.p
          className="font-mono-tech text-white/60 text-xl leading-relaxed max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        >
          {rotationTitle}
        </motion.p>

        {/* Tag strip */}
        {tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono-tech"
                style={{
                  fontSize: "0.72rem",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Bottom tag */}
        <div className="absolute bottom-10 left-16">
          <span className="font-mono-tech text-sm text-white/30 border border-white/10 rounded-full px-4 py-1.5">
            {rotationNumber} Rotation · {rotationTitle}
          </span>
        </div>
      </div>
    </div>
  );
}
