import { DebtPayment } from "@/models/debtPayment";

type TransactionSummary = {
  thisMonth: string;
  difLastMonth: number;
  totalSaved: string;
  totalDebts: number;
  currentYearTotalTransactions: number;
};

type FormStats = {
  recentTransactions: DebtPayment[];
  transactionSummary: TransactionSummary;
};

interface ApiResponseStats {
  data: FormStats;
  success: number;
  message: number;
}
export async function getFormStats(): Promise<ApiResponseStats> {
  const res = await fetch(`/api/debts/stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debt payments stats");

  const response = await res.json();
  return response;
}
