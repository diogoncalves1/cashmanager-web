import { FinancialGoal } from "@/features/financial-goals";
import { getFinancialGoalById } from "@/features/financial-goals/server";
import { useEffect, useState } from "react";

interface Props {
  id: string;
}

export function useFinancialGoal({ id }: Props) {
  const [financialGoal, setGoal] = useState<FinancialGoal>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);

  const fetchGoal = async (id: string) => {
    try {
      const res = await getFinancialGoalById(id);

      setGoal(res.data);
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
    fetchGoal(id);
  }, [id]);

  useEffect(() => {
    if (update) {
      fetchGoal(id);
      setUpdate(false);
    }
  }, [update, id]);

  return {
    financialGoal,
    loading,
    error,
    setUpdate,
  };
}
