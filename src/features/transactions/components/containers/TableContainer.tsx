"use client";

import { fetcher } from "@/shared/fetcher";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import {
  TransactionsDataTable,
  MyPagination,
  TransactionStatus,
  TransactionType,
  TransactionsSummary,
  TransactionsFilters,
} from "@/features/transactions";

type Props = {
  userId?: string;
  accountId?: string;
  load?: boolean;
  includeSummary?: boolean;
};

export const TableContainer = ({ userId, accountId, load, includeSummary = true }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStatusFilter = useDebounce(statusFilter, 500);
  const debouncedCategoryFilter = useDebounce(categoryFilter, 500);
  const debouncedTypeFilter = useDebounce(typeFilter, 500);
  const debouncedDateFrom = useDebounce(dateFrom, 500);
  const debouncedDateTo = useDebounce(dateTo, 500);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  }, []);
  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    typeFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "";

  const columnsString = () => {
    const columns = [
      { data: "date", name: "date" },
      { data: "amount", name: "amount" },
      { data: "userName", name: "userName" },
      { data: "accountName", name: "accountName" },
      { data: "categoryName", name: "categoryName" },
    ];

    const params = new URLSearchParams();

    columns.forEach((column, index) => {
      Object.entries(column).forEach(([key, value]) => {
        params.append(`columns[${index}][${key}]`, String(value));
      });
    });

    return params.toString();
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<MyPagination>({
    pageIndex: 0,
    pageSize: 10,
  });

  const extraParams = new URLSearchParams();
  if (userId) extraParams.append("userId", userId);
  if (accountId) extraParams.append("accountId", accountId);
  if (debouncedSearch) extraParams.append("search", debouncedSearch);
  if (debouncedCategoryFilter !== "all") extraParams.append("categoryId", debouncedCategoryFilter);
  if (debouncedDateFrom) extraParams.append("dateFrom", debouncedDateFrom);
  if (debouncedDateTo) extraParams.append("dateTo", debouncedDateTo);
  if (debouncedTypeFilter !== "all") extraParams.append("type", debouncedTypeFilter);
  if (debouncedStatusFilter !== "all") extraParams.append("status", debouncedStatusFilter);
  const extraOptString = extraParams.toString();

  const columnsQuery = React.useMemo(() => columnsString(), []);

  const sortingQuery = React.useMemo(
    () => sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    [sorting]
  );

  const filterQuery = React.useMemo(() => {
    return columnFilters
      .map((f) => {
        if (f.value && typeof f.value === "object") {
          return Object.entries(f.value)
            .map(([k, v]) => `${f.id}[${k}]=${v}`)
            .join("&");
        }
        return f.value ? `${f.id}=${f.value}` : "";
      })
      .filter(Boolean)
      .join("&");
  }, [columnFilters]);

  const url = React.useMemo(() => {
    return `/transactions?page=${pagination.pageIndex}&size=${pagination.pageSize}&sort=${sortingQuery}&${filterQuery}&${extraOptString}&${columnsQuery}`;
  }, [pagination, sortingQuery, filterQuery, extraOptString, columnsQuery]);

  const {
    data: apiData,
    mutate,
    isLoading,
  } = useSWR(url ? [url, { method: "GET" }] : null, fetcher);

  useEffect(() => {
    mutate();
  }, [load, mutate]);

  return (
    <div className="space-y-6">
      {includeSummary && (
        <TransactionsSummary
          totalIncome={apiData?.stats.income}
          totalExpenses={apiData?.stats.expenses}
          balance={apiData?.stats.balance}
        />
      )}
      <TransactionsFilters
        search={search}
        onSearchChange={(v: string) => {
          setSearch(v);
          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v: TransactionStatus) => {
          setStatusFilter(v);
          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
        }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(v: string) => {
          setCategoryFilter(v);
          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(v: TransactionType | "all") => {
          setTypeFilter(v);
          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
        }}
        dateFrom={dateFrom}
        onDateFromChange={(v: string) => {
          setDateFrom(v);
          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
        }}
        dateTo={dateTo}
        onDateToChange={(v: string) => {
          setDateTo(v);
          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
        }}
        categories={apiData?.categories}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <TransactionsDataTable
        pagination={pagination}
        accountId={accountId}
        userId={userId}
        data={apiData}
        isLoading={isLoading}
        mutate={mutate}
        setSorting={setSorting}
        sorting={sorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        setPagination={setPagination}
      />
    </div>
  );
};
