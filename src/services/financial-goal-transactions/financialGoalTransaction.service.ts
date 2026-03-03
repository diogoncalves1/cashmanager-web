import { FinancialGoal } from "@/models/financialGoal";
import { FinancialGoalTransaction } from "@/models/financialGoalTransactions";

interface GoalsFilters {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
}

interface ApiResponse<T> {
  data: T[];
  success: number;
  message: number;
}

export async function getAllFinancialGoals(
  filters: GoalsFilters
): Promise<ApiResponse<FinancialGoal[]>> {
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

export async function getFinancialGoalById(id: string): Promise<FinancialGoal> {
  try {
    const res = await fetch(`/api/financial-goals/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch financial goal");

    const response = await res.json();

    if (response.data) return response.data as FinancialGoal;

    throw new Error("Financial goal not found");
  } catch (err) {
    console.error(err);
    return {} as FinancialGoal;
  }
}

type TransactionSummary = {
  thisMonth: string;
  difLastMonth: number;
  totalSaved: string;
  totalGoals: number;
  currentYearTotalTransactions: number;
};

type FormStats = {
  recentTransactions: FinancialGoalTransaction[];
  transactionSummary: TransactionSummary;
};

interface ApiResponseStats {
  data: FormStats;
  success: number;
  message: number;
}

export async function getFormStats(): Promise<ApiResponseStats> {
  const res = await fetch(`/api/financial-goals/stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goals stats");

  const response = await res.json();
  return response;
}

type Summary = {
  sentInvites: number;
  receivedInvites: number;
  pendingInvites: number;
  awaitingInvites: number;
};

interface ApiResponseInvitationStats {
  data: Summary;
  success: number;
  message: number;
}

export async function getInvitationStats(): Promise<ApiResponseInvitationStats> {
  const res = await fetch(`/api/financial-goals/invitations-stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goals stats");

  const response = await res.json();
  return response;
}
