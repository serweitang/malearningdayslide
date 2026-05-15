import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MA_PHOTOS_BUCKET = "MA photos";

const LOCAL_PHOTO_OVERRIDES: Record<string, string> = {
  "iris.jpg": "/ma-photos/iris-optimized.jpg",
  "iris-optimized.jpg": "/ma-photos/iris-optimized.jpg",
  "mitty.jpg": "/ma-photos/mitty-optimized.jpg",
  "mitty-optimized.jpg": "/ma-photos/mitty-optimized.jpg",
};

export function getPhotoUrl(photoPath: string | null): string | null {
  if (!photoPath) return null;
  if (photoPath.startsWith("/") || photoPath.startsWith("http")) return photoPath;

  // Strip any bucket prefix, keep just the filename
  const filename = photoPath.replace(/^.*\//, "");
  if (LOCAL_PHOTO_OVERRIDES[filename]) return LOCAL_PHOTO_OVERRIDES[filename];

  const { data } = supabase.storage.from(MA_PHOTOS_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

export function getVideoUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
