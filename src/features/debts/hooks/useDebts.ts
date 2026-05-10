import { useCallback, useEffect, useState } from "react";
import { getAllDebts } from "@/features/debts/api/debt.api";
import { Debt } from "@/features/debts";

interface Filters {
  search?: string;
  status?: string;
  sort?: string;
}

export function useDebts(filters: Filters = {}, pageSize = 4) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        setLoading(true);

        const res = await getAllDebts({
          search: filters.search,
          status: filters.status,
          page: currentPage - 1,
          pageSize,
        });

        setTotal(res.recordsFiltered);
        setStats(res.stats || {});
        setDebts((prev) => (append ? [...prev, ...res.data] : res.data));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch debts");
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    },
    [filters.search, filters.status, pageSize]
  );

  useEffect(() => {
    setPage(1);
    fetchDebts(1, false);
  }, [fetchDebts]);

  const loadMore = () => {
    setLoadingMore(true);
    if (debts.length < total) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDebts(nextPage, true);
    }
    setLoadingMore(false);
  };

  return {
    debts,
    loading,
    error,
    loadMore,
    hasMore: total > page * pageSize ? true : false,
    total: total,
    stats,
    isLoadingMore,
  };
}
