"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMAProfiles } from "@/lib/hooks/useContent";
import { useAppStore } from "@/lib/store";
import { getPhotoUrl } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { MAProfile } from "@/types";

function joinYear(dateStr: string) {
  return new Date(dateStr).getFullYear();
}

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-garena-red/40 to-white/10 flex items-center justify-center text-white font-display text-2xl font-bold">
      {initials}
    </div>
  );
}

const EXT_FALLBACKS: Record<string, string> = { ".jpg": ".jpeg", ".jpeg": ".png", ".png": ".jpg" };

function nextSrc(url: string): string | null {
  for (const [ext, next] of Object.entries(EXT_FALLBACKS)) {
    if (url.endsWith(ext)) return url.slice(0, -ext.length) + next;
  }
  return null;
}

function MAPhoto({ url, name }: { url: string | null; name: string }) {
  const [src, setSrc] = useState(url);
  const [failed, setFailed] = useState(false);
  const isYanWei = name.toLowerCase().includes("yan wei");
  const isJoan = name.toLowerCase().includes("joan");
  const isLocalPhoto = src?.startsWith("/ma-photos/") ?? false;

  if (!src || failed) return <AvatarPlaceholder name={name} />;

  const photoStyle: React.CSSProperties = isYanWei
    ? { objectPosition: "50% 42%" }
    : isJoan
    ? { objectPosition: "60% 45%", transform: "scale(1.9)", transformOrigin: "60% 45%" }
    : undefined as unknown as React.CSSProperties;

  return (
    <Image
      src={src}
      alt={name}
      width={160}
      height={160}
      quality={100}
      unoptimized={isLocalPhoto}
      className={`w-full h-full object-cover ${isYanWei || isJoan ? "" : "object-top"}`}
      style={photoStyle}
      onError={() => {
        const alt = nextSrc(src);
        if (alt) { setSrc(alt); } else { setFailed(true); }
      }}
    />
  );
}

interface EditDrawerProps {
  profile: MAProfile;
  onClose: () => void;
  onSave: (id: number, updates: Partial<MAProfile>) => Promise<unknown>;
}

function EditDrawer({ profile, onClose, onSave }: EditDrawerProps) {
  const [form, setForm] = useState({
    name: profile.name,
    join_date: profile.join_date,
    latest_rotation: profile.latest_rotation,
  });
  const [tags, setTags] = useState<string[]>(profile.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${profile.id}.${ext}`;
    await supabase.storage.from("MA photos").upload(path, file, { upsert: true });
    await onSave(profile.id, { photo_path: `ma-photos/${path}` });
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    await onSave(profile.id, { ...form, tags });
    setSaving(false);
    onClose();
  }

  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed right-0 top-0 h-full w-80 bg-[#0D1020] border-l border-white/10 z-50 p-6 flex flex-col gap-4 overflow-y-auto"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-white font-display font-bold text-lg">Edit MA</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white text-xl">×</button>
      </div>

      <div>
        <label className="text-white/50 text-xs mb-1 block">Photo</label>
        <label className="cursor-pointer block">
          <span className="text-sm text-garena-red underline">
            {uploading ? "Uploading…" : "Upload photo"}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>
      </div>

      {(["name", "join_date", "latest_rotation"] as const).map((field) => (
        <div key={field}>
          <label className="text-white/50 text-xs mb-1 block capitalize">
            {field.replace("_", " ")}
          </label>
          <input
            type={field === "join_date" ? "date" : "text"}
            value={form[field]}
            onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-garena-red"
          />
        </div>
      ))}

      <div>
        <label className="text-white/50 text-xs mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
          {tags.map((tag) => (
            <span key={tag} className="font-mono-tech flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/60">
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="text-white/40 hover:text-white/80"
              >×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
              e.preventDefault();
              setTags((prev) => [...prev, tagInput.trim()]);
              setTagInput("");
            }
          }}
          placeholder="Type tag, press Enter"
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-garena-red"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-auto w-full py-2 bg-garena-red text-white rounded-lg font-semibold disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </motion.div>
  );
}

export function Slide2_MAIntro() {
  const { profiles, loading, updateProfile, reorderProfiles } = useMAProfiles();
  const editMode = useAppStore((s) => s.editMode);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const selectedProfile = profiles.find((p) => p.id === selectedId) ?? null;

  function handleDrop(targetIdx: number) {
    if (dragIdx !== null && dragIdx !== targetIdx) {
      const newOrder = [...profiles];
      const [moved] = newOrder.splice(dragIdx, 1);
      newOrder.splice(targetIdx, 0, moved);
      reorderProfiles(newOrder);
    }
    setDragIdx(null);
    setDragOverIdx(null);
  }

  return (
    <div className="relative w-full h-full bg-[#0A0C14] flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className="relative z-10 flex flex-col h-full"
        style={{ padding: "40px 48px" }}
      >
        <motion.h2
          className="font-display font-bold text-white mb-2"
          style={{ fontSize: "4.5rem" }}
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        >
          Meet the <span className="text-garena-red">MAs</span>
        </motion.h2>
        <div className="h-0.5 w-24 bg-garena-red mb-4" />

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-white/40">Loading…</div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-5 content-center pb-8" style={{ gap: "24px", alignContent: "center" }}>
            {profiles.map((profile, i) => {
              const photoUrl = getPhotoUrl(profile.photo_path);
              const isDraggingOver = editMode && dragOverIdx === i && dragIdx !== i;
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
                  draggable={editMode}
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => { e.preventDefault(); setDragOverIdx(i); }}
                  onDragLeave={() => setDragOverIdx(null)}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                  onClick={() => editMode && setSelectedId(profile.id)}
                  className={`group relative overflow-hidden bg-white/5 border rounded-2xl flex flex-col items-center text-center
                    ${isDraggingOver ? "border-garena-red" : "border-white/10 hover:border-white/30 hover:bg-white/[0.08]"}
                    ${dragIdx === i ? "opacity-40" : "opacity-100"}
                    ${editMode ? "cursor-grab" : ""}
                  `}
                  style={{
                    padding: "28px 20px 32px 20px",
                    gap: "12px",
                    transition: "border-color 0.25s ease, background-color 0.25s ease",
                  }}
                >
                  {editMode && (
                    <div className="absolute top-2 right-2 text-white/20 text-xs select-none">⠿</div>
                  )}

                  {/* Photo with red glow ring */}
                  <div
                    className="rounded-full overflow-hidden flex-shrink-0 transition-transform duration-[250ms] ease-out group-hover:scale-[1.04]"
                    style={{
                      width: "190px",
                      height: "190px",
                      boxShadow: "0 0 0 3px #E1251B, 0 0 18px 7px rgba(225, 37, 27, 0.4)",
                    }}
                  >
                    <MAPhoto url={photoUrl} name={profile.name} />
                  </div>

                  {/* Name + class year */}
                  <div className="mt-0.5">
                    <p className="text-white font-display font-semibold leading-tight" style={{ fontSize: "1.85rem" }}>
                      {profile.name}
                    </p>
                    <p className="text-garena-red mt-1" style={{ fontSize: "1.4rem" }}>
                      Class of {joinYear(profile.join_date)}
                    </p>
                  </div>

                  {/* Rotation pill */}
                  <div
                    className="font-mono-tech leading-snug rounded-full"
                    style={{
                      fontSize: "1.1rem",
                      padding: "6px 18px",
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {profile.latest_rotation}
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-garena-red rounded-b-2xl" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editMode && selectedProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSelectedId(null)}
            />
            <EditDrawer
              profile={selectedProfile}
              onClose={() => setSelectedId(null)}
              onSave={updateProfile}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
