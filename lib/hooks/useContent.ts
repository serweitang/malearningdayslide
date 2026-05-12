"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MAProfile, SlideContent } from "@/types";

export function useMAProfiles() {
  const [profiles, setProfiles] = useState<MAProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("ma_profiles")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("join_date", { ascending: true })
      .then(({ data }) => {
        setProfiles(data ?? []);
        setLoading(false);
      });
  }, []);

  const updateProfile = useCallback(async (id: number, updates: Partial<MAProfile>) => {
    const { error } = await supabase.from("ma_profiles").upsert({ id, ...updates });
    if (!error) {
      setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    }
    return error;
  }, []);

  const reorderProfiles = useCallback(async (newOrder: MAProfile[]) => {
    const updated = newOrder.map((p, idx) => ({ ...p, sort_order: idx + 1 }));
    setProfiles(updated);
    await Promise.all(
      updated.map((p) => supabase.from("ma_profiles").update({ sort_order: p.sort_order }).eq("id", p.id))
    );
  }, []);

  return { profiles, loading, updateProfile, reorderProfiles };
}

export function useSlideContent(slideId: string) {
  const [content, setContent] = useState<SlideContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("slide_content")
      .select("*")
      .eq("slide_id", slideId)
      .single()
      .then(({ data }) => {
        setContent(data);
        setLoading(false);
      });
  }, [slideId]);

  const updateContent = useCallback(async (updates: Partial<SlideContent>) => {
    const payload = { slide_id: slideId, ...updates };
    const { data, error } = await supabase
      .from("slide_content")
      .upsert(payload, { onConflict: "slide_id" })
      .select()
      .single();
    if (!error && data) setContent(data);
    return error;
  }, [slideId]);

  return { content, loading, updateContent };
}
