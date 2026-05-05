import { FinancialGoalTransaction } from "@/models/financialGoalTransactions";

interface ApiResponse<T> {
  data: T;
  meta: number;
}

export async function getFinancialGoalTransactionById(
  id: string
): Promise<ApiResponse<FinancialGoalTransaction>> {
  const res = await fetch(`/api/financial-goal-transactions/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goal transaction");

  const response = await res.json();
  return response;
}
