import { FinancialGoal } from "@/models/financialGoal";
import { useCallback, useEffect, useState } from "react";
import { getAllFinancialGoals } from "../services/financialGoal.service";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}

type Stats = {
  totalGoals?: number;
  activeGoals?: number;
  totalTarget?: number;
  totalSavedFormated?: string;
  totalSaved?: number;
};

export function useFinancialGoals(filters: Filters = {}, pageSize = 6) {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({});
  const [error, setError] = useState(false);

  const fetchGoals = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        setLoading(true);

        const res = await getAllFinancialGoals({ ...filters, page: currentPage - 1, pageSize });

        setTotal(res.recordsFiltered);
        setStats(res.stats);
        setGoals((prev) => (append ? [...prev, ...res.data] : res.data));
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [filters, pageSize]
  );

  useEffect(() => {
    setPage(1);
    fetchGoals(1, false);
  }, [filters, fetchGoals]);

  const loadMore = () => {
    if (goals.length < total) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchGoals(nextPage, true);
    }
  };

  return {
    goals,
    loading,
    error,
    loadMore,
    hasMore: total > page * pageSize ? true : false,
    total: total,
    stats,
  };
}
