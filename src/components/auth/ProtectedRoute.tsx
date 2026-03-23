"use client";

import { fetcher } from "@/lib/fetcher";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, error } = useSWR(["/auth/me", { method: "GET" }], fetcher);

  useEffect(() => {
    if (error || (!isLoading && data == undefined) || (data && !data.token)) {
      router.push(`/signin?from=${pathname}`);
    }
  }, [data, isLoading, error, router, pathname]);

  if (isLoading || data == undefined) return <div></div>;

  return <>{children}</>;
}
