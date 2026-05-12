import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MA_PHOTOS_BUCKET = "MA photos";

export function getPhotoUrl(photoPath: string | null): string | null {
  if (!photoPath) return null;
  // Strip any bucket prefix, keep just the filename
  const filename = photoPath.replace(/^.*\//, "");
  const { data } = supabase.storage.from(MA_PHOTOS_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

export function getVideoUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
