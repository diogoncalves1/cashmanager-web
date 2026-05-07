import React from "react";
import AdminLayoutClient from "@/components/layout/AdminLayoutClient";
import { AuthProvider } from "@/context/AuthContext";
import { User } from "@/types/user";
import { getUser } from "@/lib/auth/getUser";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <AuthProvider user={user ?? ({} as User)}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthProvider>
  );
}
