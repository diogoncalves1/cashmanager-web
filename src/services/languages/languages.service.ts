import { Language } from "@/models/language";

interface ApiResponse<T> {
  data: T[];
  success: boolean;
}

export async function getLanguages(): Promise<ApiResponse<Language>> {
  const res = await fetch(`/api/languages`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debts");

  const response = await res.json();
  return response;
}
