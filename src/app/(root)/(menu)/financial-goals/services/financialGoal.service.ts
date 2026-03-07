import { FinancialGoal } from "@/models/financialGoal";

interface GoalsFilters {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
}

type Stats = {
  totalGoals?: number;
  activeGoals?: number;
  totalTarget?: number;
  totalSavedFormated?: string;
  totalSaved?: number;
};

interface ApiResponse<T> {
  data: T[];
  recordsFiltered: number;
  page: number;
  pageSize: number;
  stats: Stats;
}

export async function getAllFinancialGoals(
  filters: GoalsFilters
): Promise<ApiResponse<FinancialGoal>> {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== null) as [string, string][]
  );

  const res = await fetch(`/api/financial-goals?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goals");

  const response = await res.json();
  return response;
}
