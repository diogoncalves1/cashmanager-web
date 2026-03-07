"use client";

import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data, isLoading, error } = useSWR(["/auth/me", { method: "GET" }], fetcher);

  useEffect(() => {
    // Se houve erro ou não existe data, redireciona
    if (error || (!isLoading && !data) || (data && !data.token)) {
      router.push("/signin");
    }
  }, [data, isLoading, error, router]);

  // Enquanto carrega, não renderiza o conteúdo protegido
  if (isLoading || !data) return <div>Loading...</div>;

  return <>{children}</>;
}
