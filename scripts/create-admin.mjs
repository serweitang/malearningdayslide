/**
 * One-time script to create tangsw@garena.com as admin in Firebase Auth.
 * Usage:
 *   1. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local (see below)
 *   2. Run: node scripts/create-admin.mjs
 *
 * FIREBASE_SERVICE_ACCOUNT_KEY should be the full service account JSON, minified to one line:
 *   Go to Firebase Console → Project Settings → Service Accounts → Generate new private key
 *   Download the JSON, then paste its content (minified) as the env var value.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no dotenv dependency needed)
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
    "   Add it as a single-line JSON string:\n" +
    '   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}'
  );
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountKey);
} catch {
  console.error("❌  FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON. Make sure it is a minified single-line JSON string.");
  process.exit(1);
}

// Dynamic import of firebase-admin after we know the key exists
const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getAuth } = await import("firebase-admin/auth");

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const ADMIN_EMAIL = "tangsw@garena.com";
const ADMIN_PASSWORD = "GarenaMA2026!"; // Change this after first login

const auth = getAuth();

try {
  // Check if user already exists
  const existing = await auth.getUserByEmail(ADMIN_EMAIL).catch(() => null);

  if (existing) {
    console.log(`✅  User ${ADMIN_EMAIL} already exists (uid: ${existing.uid})`);
    console.log("   No changes made. To reset the password, run this script again after deleting the user in Firebase Console.");
  } else {
    const user = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: "Tang SW (Admin)",
      emailVerified: true,
    });
    console.log(`✅  Created admin user: ${user.email} (uid: ${user.uid})`);
    console.log(`   Temporary password: ${ADMIN_PASSWORD}`);
    console.log("   ⚠️  Change this password in Firebase Console after first login.");
  }
} catch (err) {
  console.error("❌  Failed to create user:", err.message);
  process.exit(1);
}
