"use client";

import { createContext, useContext } from "react";
import { User } from "@/shared/types/user";

interface AuthContextType {
  user: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return ctx;
}
