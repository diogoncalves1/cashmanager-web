"use client";

import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data, isLoading, error } = useSWR(["/auth/me", { method: "GET" }], fetcher);

  useEffect(() => {
    if (error) {
      router.push("/signin");
    }
    if (!isLoading && !data) {
      router.push("/signin");
    }
  }, [data, isLoading, router]);

  if (isLoading) return <div></div>;

  if (!data.token) router.push("/signin");

  return <>{children}</>;
}
