import { useState, useEffect } from "react";
import { FinancialGoalTransaction } from "@/models/financialGoalTransactions";
import { getFormStats } from "@/services/financial-goal-transactions/financialGoalTransaction.service";

type TransactionSummary = {
  thisMonth: string;
  difLastMonth: number;
  totalSaved: string;
  totalGoals: number;
  currentYearTotalTransactions: number;
};

export function useFormStats(id?: string) {
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary>();
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<FinancialGoalTransaction[]>([]);

  const fetchStats = async () => {
    try {
      const res = await getFormStats();

      setTransactionSummary(res.data.transactionSummary);
      setRecentTransactions(res.data.recentTransactions);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    transactionSummary,
    recentTransactions,
    loading,
  };
}
