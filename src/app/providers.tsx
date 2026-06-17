"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/auth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function Providers({ children }: { children: React.ReactNode }) {
  // Always wrap with GoogleOAuthProvider to prevent build errors on Vercel
  // when env vars might be temporarily missing during prerendering.
  const clientId = GOOGLE_CLIENT_ID || "dummy_client_id_for_build";
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
