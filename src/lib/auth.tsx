"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  provider: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "scanin_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persist token
  const saveToken = useCallback((t: string) => {
    setToken(t);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, t);
    }
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  // Load token on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      authApi
        .me(stored)
        .then((res) => {
          if (res.success && res.data) {
            const userData = (res.data as { user: User }).user;
            setUser(userData);
          } else {
            clearAuth();
          }
        })
        .catch(() => clearAuth())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        const d = res.data as { user: User; token: string };
        setUser(d.user);
        saveToken(d.token);
        return { success: true };
      }
      return { success: false, error: res.error || "Login gagal." };
    },
    [saveToken]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await authApi.register(name, email, password);
      if (res.success && res.data) {
        const d = res.data as { user: User; token: string };
        setUser(d.user);
        saveToken(d.token);
        return { success: true };
      }
      return { success: false, error: res.error || "Registrasi gagal." };
    },
    [saveToken]
  );

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      const res = await authApi.google(credential);
      if (res.success && res.data) {
        const d = res.data as { user: User; token: string };
        setUser(d.user);
        saveToken(d.token);
        return { success: true };
      }
      return { success: false, error: res.error || "Google login gagal." };
    },
    [saveToken]
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
