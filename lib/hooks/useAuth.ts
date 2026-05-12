"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, loginWithGoogle, logout as firebaseLogout } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";

const ADMIN_EMAIL = "tangsw@garena.com";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setEditMode = useAppStore((s) => s.setEditMode);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const isAdmin = !!u && u.email === ADMIN_EMAIL;
      setUser(isAdmin ? u : null);
      setEditMode(isAdmin);
      setLoading(false);
    });
    return unsub;
  }, [setEditMode]);

  async function login() {
    const cred = await loginWithGoogle();
    if (cred.user.email !== ADMIN_EMAIL) {
      await firebaseLogout();
      throw new Error("Only the admin account may sign in.");
    }
  }

  async function logout() {
    await firebaseLogout();
    setEditMode(false);
  }

  return { user, isAuthenticated: !!user, loading, login, logout };
}
