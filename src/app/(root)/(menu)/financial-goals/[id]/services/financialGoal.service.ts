import { FinancialGoal } from "@/models/financialGoal";

interface ApiResponse<T> {
  data: T;
  meta: number;
}

export async function getFinancialGoalById(id: string): Promise<ApiResponse<FinancialGoal>> {
  const res = await fetch(`/api/financial-goals/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goal");

  const response = await res.json();
  return response;
}
