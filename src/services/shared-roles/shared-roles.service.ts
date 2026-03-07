import { SharedRole } from "@/models/sharedRole";

interface ApiResponse<T> {
  data: T;
  additionals: number;
}

export async function getSharedRoles(): Promise<ApiResponse<SharedRole[]>> {
  const res = await fetch(`/api/shared-roles`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch shared roles");

  const response = await res.json();
  return response;
}
