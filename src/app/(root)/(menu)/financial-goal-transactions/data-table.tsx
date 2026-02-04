"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Dot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Badge from "@/components/ui/badge/Badge";
import { AppLink } from "@/components/ui/button/AppLink";
import { useTranslations } from "next-intl";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import {
  FinancialGoalTransaction,
  financialGoalTransactionStatus,
  financialGoalTransactionTypes,
} from "@/models/financialGoalTransactions";
import { cn, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinancialGoalTransactionForm } from "@/app/(root)/(menu)/financial-goal-transactions/create/hooks/useFinancialGoalTransactionForm";
import EditGoalTransactionDialog from "@/components/ui/dialogs/GoalTransactions/EditGoalTransactionDialog";
import DeleteGoalTransactionDialog from "@/components/ui/dialogs/GoalTransactions/DeleteGoalTransactionDialog";
import DataTable from "@/components/tables/DataTable";
import ConfirmGoalTransactionDialog from "@/components/ui/dialogs/GoalTransactions/ConfirmGoalTransactionDialog";

type DataTableProps = {
  enableFilters?: boolean;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
  enableTypeFilter?: boolean;
  financialGoalId?: string;
  enableUser?: boolean;
  userId?: string;
};

interface Filters {
  search?: string;
  status?: string;
  type?: string;
}

export function FinancialGoalTransactionsDataTable({
  enableSearch = true,
  enableStatusFilter = true,
  enableTypeFilter = true,
  financialGoalId,
  enableUser = true,
  userId,
}: DataTableProps) {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  const monthsT = useTranslations("MONTHS");
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);

  const columnsString = () => {
    const columns = [
      { data: "date", name: "date", searchble: true },
      { data: "amount", name: "amount", searchble: true },
      { data: "userName", name: "userName", searchble: true },
      { data: "financialGoalName", name: "financialGoalName", searchble: true },
      { data: "accountName", name: "accountName", searchble: true },
    ];

    const params = new URLSearchParams();

    columns.forEach((column, index) => {
      Object.entries(column).forEach(([key, value]) => {
        params.append(`columns[${index}][${key}]`, String(value));
      });
    });

    return params.toString();
  };

  const [isEditGoalOpen, setIsEditGoalOpen] = React.useState(false);
  const [isConfirmDialogOpen, setIsConfirmOpen] = React.useState(false);
  const [isDeleteGoalOpen, setIsDeleteGoalOpen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [total, setTotal] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState("0");

  const { formData, setFormData, handleSubmit } = useFinancialGoalTransactionForm(selectedId);

  const extraParams = new URLSearchParams();
  if (userId) extraParams.append("userId", userId);
  if (financialGoalId) extraParams.append("financialGoalId", financialGoalId);
  const extraOptString = extraParams.toString();

  const columnsQuery = React.useMemo(() => columnsString(), []);

  const sortingQuery = React.useMemo(
    () => sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    [sorting]
  );

  const [filters, setFilters] = React.useState<Filters>({});

  const [debouncedUrl, setDebouncedUrl] = React.useState<string>("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v !== null) as [string, string][]
      );

      const url = `/financial-goal-transactions?page=${pagination.pageIndex}&size=${pagination.pageSize}&sort=${sortingQuery}&${params.toString()}&${extraOptString}&${columnsQuery}`;

      setDebouncedUrl(url);
    }, 300);

    return () => clearTimeout(handler); // limpa timeout se filtros mudarem antes de 500ms
  }, [pagination, sortingQuery, filters, extraOptString, columnsQuery]);
  const {
    data: apiData,
    mutate,
    isLoading,
  } = useSWR(debouncedUrl ? [debouncedUrl, { method: "GET" }] : null, fetcher);

  React.useEffect(() => {
    if (apiData) {
      setPageCount(Math.ceil(apiData.recordsTotal / pagination.pageSize));
      setTotal(apiData.recordsTotal);
    }
  }, [apiData, pagination.pageSize]);

  const columns: ColumnDef<FinancialGoalTransaction>[] = React.useMemo(
    () => [
      {
        accessorKey: "type",
        header: () => "Type",
        cell: ({ row }) => {
          const tx = row.original;

          return (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center",
                  tx.type === "contribution" ? "bg-accent/10" : "bg-destructive/10"
                )}
              >
                {tx.type === "contribution" ? (
                  <svg
                    className="w-3.5 h-3.5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3.5 h-3.5 text-destructive"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                )}
              </div>
              <span className="capitalize text-sm">{tx.type}</span>
            </div>
          );
        },
      },
      ...(enableUser
        ? [
            {
              accessorKey: "user",
              header: "User",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] bg-secondary">
                      {row.original.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{row.original.userName}</span>
                </div>
              ),
            } as ColumnDef<FinancialGoalTransaction>,
          ]
        : []),
      ...(!financialGoalId
        ? [
            {
              accessorKey: "financialGoal",
              header: t("FINANCIAL_GOAL"),
              cell: ({ row }) => (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-light text-md capitalize">
                      {row.original.financialGoalName}
                    </span>
                  </div>
                </div>
              ),
            } as ColumnDef<FinancialGoalTransaction>,
          ]
        : []),
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.date, monthsT),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            type="rounded"
            size="sm"
            color={row.original.status == "pending" ? "warning" : "success"}
          >
            <Dot className="size-4" strokeWidth={6} />
            {row.original.statusTranslated}
          </Badge>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span
                  className={`font-medium ${
                    t.type === "contribution" ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {t.type === "contribution" ? "+" : "-"} {t.amountFormated}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {transaction.actions?.confirm && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedId(transaction.id);

                        setIsConfirmOpen(true);
                      }}
                    >
                      Confirmar Transação
                    </DropdownMenuItem>
                  )}
                  {transaction.actions?.view && (
                    <Link href={`/financial-goal-transactions/${transaction.id}`}>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </Link>
                  )}
                  {transaction.actions?.edit && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedId(transaction.id);
                        setFormData({
                          description: transaction.description,
                          date: transaction.date,
                          amount: transaction.amount,
                        });

                        setIsEditGoalOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {transaction.actions?.destroy && (
                    <DropdownMenuItem
                      onClick={async () => {
                        setSelectedId(transaction.id);
                        setIsDeleteGoalOpen(true);
                      }}
                      variant="destructive"
                    >
                      Delete Transaction
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          );
        },
      },
    ],
    [enableUser, financialGoalId, mutate, pagination]
  );

  const table = useReactTable({
    data: apiData?.data ?? [],
    columns: columns,
    pageCount: pageCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const transactionStatus = financialGoalTransactionStatus(t);
  const transactionTypes = financialGoalTransactionTypes(t);

  return (
    <div className="w-full bg-white rounded-sm border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
          <p className="text-sm text-muted-foreground">{total} total transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {enableSearch && (
            <div className="col-span-2">
              <Input
                placeholder={`${t("SEARCH")}...`}
                value={filters?.search || ""}
                onChange={(e) => setFilters((prev: any) => ({ ...prev, search: e.target.value }))}
              />
            </div>
          )}
          {enableTypeFilter && (
            <Select
              value={filters?.type || "all"}
              onValueChange={(v) =>
                setFilters((prev: any) => ({ ...prev, type: v !== "all" ? v : null }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {enableStatusFilter && (
            <Select
              value={filters?.status || "all"}
              onValueChange={(v) =>
                setFilters((prev: any) => ({ ...prev, status: v !== "all" ? v : null }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {transactionStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div>
            <AppLink variant="default" path="/financial-goal-transactions/create">
              <Plus className="size-5" />
              {t("ADD")}
            </AppLink>
          </div>
        </div>
      </div>

      <DataTable table={table} columns={columns} isLoading={isLoading} />

      <DataTablePagination
        table={table}
        pageCount={pageCount}
        total={total}
        pagination={pagination}
        t={t}
      />

      <EditGoalTransactionDialog
        isEditGoalOpen={isEditGoalOpen}
        setIsEditGoalOpen={setIsEditGoalOpen}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        mutate={mutate}
        formData={formData}
      />

      <DeleteGoalTransactionDialog
        isDeleteDialogOpen={isDeleteGoalOpen}
        setIsDeleteOpen={setIsDeleteGoalOpen}
        mutate={mutate}
        table={table}
        pagination={pagination}
        selectedId={selectedId}
      />

      <ConfirmGoalTransactionDialog
        setIsConfirmOpen={setIsConfirmOpen}
        isConfirmDialogOpen={isConfirmDialogOpen}
        mutate={mutate}
        selectedId={selectedId}
      />
    </div>
  );
}
