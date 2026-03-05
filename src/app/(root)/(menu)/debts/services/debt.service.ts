import { Debt } from "@/models/debt";

interface DebtsFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

interface ApiResponse<T> {
  data: T[];
  recordsFiltered: number;
  page: number;
  pageSize: number;
  stats: Record<string, string>;
}

export async function getAllDebts(filters: DebtsFilters): Promise<ApiResponse<Debt>> {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== null && v !== undefined) as [string, string][]
  );

  const res = await fetch(`/api/debts?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debts");

  const response = await res.json();
  return response;
}
