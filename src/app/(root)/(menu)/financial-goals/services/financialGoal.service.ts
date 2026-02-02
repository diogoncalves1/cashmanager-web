import { FinancialGoal } from "@/models/financialGoal";

interface GoalsFilters {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
}

interface ApiResponse<T> {
  data: T[];
  recordsFiltered: number;
  page: number;
  pageSize: number;
  stats: Record<string, any>;
}

export async function getAllFinancialGoals(
  filters: GoalsFilters
): Promise<ApiResponse<FinancialGoal[]>> {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([_, v]) => v !== null) as [string, string][]
  );

  const res = await fetch(`/api/financial-goals?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goals");

  const response = await res.json();
  return response;
}
