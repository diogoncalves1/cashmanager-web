import { Debt } from "@/models/debt";

interface ApiResponse<T> {
  data: T;
  additionals: number;
}

export async function getDebtById(id: string): Promise<ApiResponse<Debt>> {
  const res = await fetch(`/api/debts/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debt");

  const response = await res.json();
  return response;
}
