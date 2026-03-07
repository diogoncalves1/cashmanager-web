import { FinancialGoalBasic } from "@/models/financialGoal";

interface ApiResponse<T> {
  data: T;
}

export async function getAllFinancialGoals(): Promise<ApiResponse<FinancialGoalBasic[]>> {
  const res = await fetch(`/api/financial-goals/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goals");

  const response = await res.json();
  return response;
}
