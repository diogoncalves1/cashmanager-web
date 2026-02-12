import { useCallback, useEffect, useState } from "react";
import { getAllAccounts } from "../services/account.service";
import { Account } from "@/models/account";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}

type Stats = {
  activeAccounts?: number;
  netWorth?: string;
  totalRevenues?: string;
  totalExpenses?: string;
};

export function useAccounts(filters: Filters = {}, pageSize = 9) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({});
  const [error, setError] = useState(false);

  const fetchGoals = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        setLoading(true);

        const res = await getAllAccounts({ ...filters, page: currentPage - 1, pageSize });

        setTotal(res.recordsFiltered);
        setStats(res.stats);
        setAccounts((prev: any) => (append ? [...prev, ...res.data] : res.data));
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    setPage(1);
    fetchGoals(1, false);
  }, [filters, fetchGoals]);

  const loadMore = () => {
    if (accounts.length < total) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchGoals(nextPage, true);
    }
  };

  return {
    accounts,
    loading,
    error,
    loadMore,
    hasMore: total > page * pageSize ? true : false,
    total: total,
    stats,
  };
}
