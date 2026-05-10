import React from "react";
import AdminLayoutClient from "@/components/layout/AdminLayoutClient";
import { AuthProvider } from "@/features/auth";
import { User } from "@/types/user";
import { getUser } from "@/features/auth/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <AuthProvider user={user ?? ({} as User)}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthProvider>
  );
}
