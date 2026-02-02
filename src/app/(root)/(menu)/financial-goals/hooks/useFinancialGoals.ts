import { FinancialGoal } from "@/models/financialGoal";
import { useEffect, useState } from "react";
import { getAllFinancialGoals } from "../services/financialGoal.service";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}

export function useFinancialGoals(filters: Filters = {}, pageSize = 6) {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [error, setError] = useState(false);

  const fetchGoals = async (currentPage = 1, append = false) => {
    try {
      setLoading(true);

      const res = await getAllFinancialGoals({ ...filters, page: currentPage - 1, pageSize });

      setTotal(res.recordsFiltered);
      setStats(res.stats || {});
      setGoals((prev: any) => (append ? [...prev, ...res.data] : res.data));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchGoals(1, false);
  }, [filters.status, filters.priority, filters.search, filters.sort]);

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
