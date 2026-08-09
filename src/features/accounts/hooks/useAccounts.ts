import { useCallback, useEffect, useMemo, useState } from "react";
import { Account, AccountFiltersType, Stats } from "@/features/accounts";
import { getAllAccounts } from "@/features/accounts/server";

export function useAccounts(filters: AccountFiltersType = {}, pageSize = 9) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({});
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  // Estabiliza `filters` pelo conteúdo (não pela referência), para não
  // recriar fetchAccounts/disparar o useEffect a cada render.
  const filtersKey = JSON.stringify(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableFilters = useMemo(() => filters, [filtersKey]);

  const fetchAccounts = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        setLoading(true);

        const res = await getAllAccounts({ ...stableFilters, page: currentPage - 1, pageSize });

        setTotal(res.recordsFiltered);
        setStats(res.stats);
        setAccounts((prev: Account[]) => (append ? [...prev, ...res.data] : res.data));
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [stableFilters, pageSize]
  );

  useEffect(() => {
    setPage(1);
    fetchAccounts(1, false);
  }, [stableFilters, fetchAccounts]);

  useEffect(() => {
    if (!load) return;
    fetchAccounts(1);
  }, [load, fetchAccounts]);

  const loadMore = () => {
    if (accounts.length < total) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAccounts(nextPage, true);
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
    setLoad,
  };
}
