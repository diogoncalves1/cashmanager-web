import { useEffect, useState } from "react";
import { Debt } from "@/features/debts";
import { getDebtById } from "@/features/debts/server";

export function useDebt(id: string) {
  const [debt, setDebt] = useState<Debt>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [load, setLoad] = useState(false);

  const fetchDebt = async (id: string) => {
    try {
      const res = await getDebtById(id);

      setDebt(res.data);
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
    fetchDebt(id);
  }, [id, load]);

  return {
    debt,
    loading,
    error,
    mutate: () => {
      setLoad(true);
    },
  };
}
