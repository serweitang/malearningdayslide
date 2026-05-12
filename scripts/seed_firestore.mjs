/**
 * One-time script to seed Firestore with MA profiles and slide content.
 * Usage:
 *   1. Add FIREBASE_SERVICE_ACCOUNT_KEY to .env.local (same key used by create-admin.mjs)
 *   2. Run: node scripts/seed_firestore.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, "../.env.local");
const envLines = readFileSync(envPath, "utf-8").split("\n");
const env = {};
for (const line of envLines) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
}

const serviceAccountKey = env["FIREBASE_SERVICE_ACCOUNT_KEY"];
if (!serviceAccountKey) {
  console.error(
    "❌  FIREBASE_SERVICE_ACCOUNT_KEY is missing from .env.local\n" +
    "   Download your service account JSON from Firebase Console → Project Settings → Service Accounts\n" +
    '   Add it as a single-line JSON string:\n' +
    '   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}'
  );
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountKey);
} catch {
  console.error("❌  FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON.");
  process.exit(1);
}

const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

const MA_PROFILES = [
  { id: "1",  name: "Xia Zhiyu (Iris)",      join_date: "2024-07-05", latest_rotation: "Rotation 4: GI Marketing (Helen Hu)",            photo_path: "ma-photos/iris.jpg",     sort_order: 1  },
  { id: "2",  name: "Liu Shujian (Harry)",    join_date: "2024-07-05", latest_rotation: "Rotation 3: FF NA User Growth (Jason Lim)",       photo_path: "ma-photos/harry.jpg",    sort_order: 2  },
  { id: "3",  name: "Jin Yingjie (Joyce)",    join_date: "2025-02-24", latest_rotation: "Rotation 3: GI Daydream Game Design",            photo_path: "ma-photos/joyce.jpg",    sort_order: 3  },
  { id: "4",  name: "Yan Wei",                join_date: "2025-03-03", latest_rotation: "Rotation 3: Craftland PUGC (Zeus)",               photo_path: "ma-photos/yanwei.jpg",   sort_order: 4  },
  { id: "5",  name: "Zhuang Yuan (Mitty)",    join_date: "2025-06-30", latest_rotation: "Rotation 2: GI Onemore (Tang Jiaqi)",             photo_path: "ma-photos/mitty.jpg",    sort_order: 5  },
  { id: "6",  name: "Joan Chin",              join_date: "2025-07-14", latest_rotation: "Rotation 2: GI PM (Tang Jiaqi)",                 photo_path: "ma-photos/joan.jpg",     sort_order: 6  },
  { id: "7",  name: "Shang Ruting",           join_date: "2026-01-05", latest_rotation: "Rotation 1: AOV Regional Product (Helen Chang)", photo_path: "ma-photos/ruting.jpg",   sort_order: 7  },
  { id: "8",  name: "Xu Zhanxiao",            join_date: "2026-01-05", latest_rotation: "Rotation 1: Executive Office (Helen Hu)",         photo_path: "ma-photos/zhanxiao.jpg", sort_order: 8  },
  { id: "9",  name: "Chen Haolin",            join_date: "2026-02-25", latest_rotation: "Pre-MA Internship: FF Dev PM (Han Yu)",           photo_path: "ma-photos/haolin.jpg",   sort_order: 9  },
  { id: "10", name: "Joshua Lim",             join_date: "2026-03-02", latest_rotation: "Rotation 1: FF Regional UR (Fuji)",               photo_path: "ma-photos/joshua.jpg",   sort_order: 10 },
];

const SLIDE_CONTENT = [
  { id: "slide3", title: "Video Showcase 1", video_url_1: null, video_url_2: null, video_url_3: null },
  { id: "slide4", title: "Video Showcase 2", video_url_1: null, video_url_2: null, video_url_3: null },
  { id: "slide5", title: "Video Showcase 3", video_url_1: null, video_url_2: null, video_url_3: null },
  { id: "slide6", title: "Video Showcase 4", video_url_1: null, video_url_2: null, video_url_3: null },
];

console.log("Seeding ma_profiles...");
for (const { id, ...data } of MA_PROFILES) {
  await db.collection("ma_profiles").doc(id).set(data, { merge: true });
  console.log(`  ✓ ${data.name}`);
}

console.log("Seeding slide_content...");
for (const { id, ...data } of SLIDE_CONTENT) {
  await db.collection("slide_content").doc(id).set(data, { merge: true });
  console.log(`  ✓ ${id}`);
}

console.log("✅  Firestore seeded successfully.");
