// app/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Importante: criar o client APENAS uma vez (useState sem dependências)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configurações recomendadas para app social
            staleTime: 1000 * 60 * 4, // 4 minutos – amigos não mudam a cada segundo
            gcTime: 1000 * 60 * 45, // cache dura 45 min inativo
            refetchOnWindowFocus: false, // evita refetch ao voltar à aba
            refetchOnReconnect: false,
            retry: 2,
            // networkMode: 'offlineFirst', // opcional se quiseres mais agressivo
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools – muito útil em desenvolvimento (aparece um botão flutuante) */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}
