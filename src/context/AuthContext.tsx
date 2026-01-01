"use client";

import { User } from "@/lib/models/user";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ logged: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega sessão salva no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string, remeber: boolean) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remeber }),
    });

    const data = await res.json();

    if (!data.user) return { logged: false };

    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    return { logged: true };
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
