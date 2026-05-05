import { Account } from "@/types/account";

interface GoalsFilters {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
}

type Stats = {
  activeAccounts?: number;
  netWorth?: string;
  totalRevenues?: string;
  totalExpenses?: string;
};

interface ApiResponse<T> {
  data: T[];
  recordsFiltered: number;
  page: number;
  pageSize: number;
  stats: Stats;
}

export async function getAllAccounts(filters: GoalsFilters): Promise<ApiResponse<Account>> {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== null) as [string, string][]
  );

  const res = await fetch(`/api/accounts?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch accounts");

  const response = await res.json();
  return response;
}
