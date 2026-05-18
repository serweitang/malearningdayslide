"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSlideContent } from "@/lib/hooks/useContent";
import { useAppStore } from "@/lib/store";
import { EditableField } from "@/components/ui/EditableField";
import { supabase } from "@/lib/supabase";

interface Props {
  slideNumber: number;
}

function VideoBox({
  url,
  index,
  slideId,
  onUpload,
}: {
  url: string | null;
  index: number;
  slideId: string;
  onUpload: (key: string, url: string) => void;
}) {
  const editMode = useAppStore((s) => s.editMode);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const key = `video_url_${index + 1}` as "video_url_1" | "video_url_2" | "video_url_3";

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    setProgress(`Uploading ${file.name}…`);
    const path = `${slideId}/video${index + 1}_${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("video-slides").upload(path, file, { upsert: true });
    if (error) {
      setUploadError(`Upload failed: ${error.message}`);
      setUploading(false);
      setProgress("");
      return;
    }
    setProgress("Saving…");
    const { data } = supabase.storage.from("video-slides").getPublicUrl(path);
    await onUpload(key, data.publicUrl);
    setUploading(false);
    setProgress("");
  }

  return (
    <div className="flex-1 h-full border-2 border-dashed border-white/20 rounded-xl overflow-hidden relative flex items-center justify-center bg-white/5 hover:border-white/30 transition">
      {url ? (
        <>
          <video src={url} controls className="w-full h-full object-contain" />
          {editMode && !uploading && (
            <label className="absolute top-2 right-2 cursor-pointer bg-black/70 hover:bg-garena-red text-white text-xs font-mono-tech px-3 py-1 rounded transition">
              Replace
              <input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
            </label>
          )}
          {uploading && (
            <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-mono-tech px-3 py-1 rounded animate-pulse">{progress}</span>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 text-white/30">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Video {index + 1}</span>

          {uploading && (
            <span className="text-xs text-white/50 animate-pulse">{progress}</span>
          )}

          {uploadError && (
            <span className="text-xs text-garena-red text-center max-w-xs px-2">{uploadError}</span>
          )}

          {editMode && !uploading && (
            <label className="mt-1 cursor-pointer text-garena-red text-xs underline">
              Upload Video
              <input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
            </label>
          )}
        </div>
      )}
    </div>
  );
}

export function VideoPlaceholderSlide({ slideNumber }: Props) {
  const slideId = `slide${slideNumber}`;
  const { content, updateContent } = useSlideContent(slideId);

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

      <div className="relative z-10 flex flex-col h-full px-12 py-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono-tech text-garena-red font-bold tracking-widest uppercase" style={{ fontSize: "1.5rem" }}>
            MA AI-Video Introduction
          </span>
        </div>
        <motion.h2
          className="font-display font-bold text-white mb-6"
          style={{ fontSize: "3.5rem" }}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        >
          <EditableField
            value={content?.title ?? "MA AI-Video Introduction"}
            onSave={(val) => updateContent({ title: val })}
            className="font-display font-bold text-white"
            placeholder="Slide title…"
          />
        </motion.h2>

        <div className="flex gap-4 items-stretch" style={{ height: "680px" }}>
          <VideoBox
            url={content?.video_url_1 ?? null}
            index={0}
            slideId={slideId}
            onUpload={(key, url) => updateContent({ [key]: url })}
          />
        </div>
      </div>
    </div>
  );
}
