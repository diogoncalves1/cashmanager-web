import { useEffect, useState } from "react";
import { getFinancialGoalTransactionById } from "../services/financialGoalTransaction.service";
import { FinancialGoalTransaction } from "@/models/financialGoalTransactions";

interface Props {
  id: string;
}

export function useFinancialGoalTransaction({ id }: Props) {
  const [goalTransaction, setGoalTransaction] = useState<FinancialGoalTransaction>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);

  const fetchGoalTransaction = async (id: string) => {
    try {
      const res = await getFinancialGoalTransactionById(id);

      setGoalTransaction(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || "Failed to fetch financial goals");
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalTransaction(id);
  }, [id]);

  useEffect(() => {
    if (update) {
      fetchGoalTransaction(id);
      setUpdate(false);
    }
  }, [update]);

  return {
    goalTransaction,
    loading,
    error,
    setUpdate,
  };
}
