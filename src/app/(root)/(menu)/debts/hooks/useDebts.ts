import { useEffect, useState } from "react";
import { getAllDebts } from "../services/debt.service";
import { Debt } from "@/models/debt";

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
  const [stats, setStats] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = async (currentPage = 1, append = false) => {
    try {
      setLoading(true);
      const res = await getAllDebts({ ...filters, page: currentPage - 1, pageSize });

      setTotal(res.recordsFiltered);
      setStats(res.stats || {});
      setDebts((prev) => (append ? [...prev, ...res.data] : res.data));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch financial goals");
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchDebts(1, false);
  }, [filters.status, filters.search, filters.sort]);

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
