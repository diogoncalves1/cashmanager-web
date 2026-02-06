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
import { financialGoalTransactionStatus } from "@/models/financialGoalTransactions";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DebtPayment } from "@/models/debtPayment";
import { onConfirmDebtPayment, onDeleteDebtPayment } from "@/services/debt-payments/service";
import { useDebtPaymentForm } from "@/components/form/debt-payments/hooks/useDebtPaymentForm";
import DataTable from "@/components/tables/DataTable";
import EditDebtPaymentDialog from "@/components/ui/dialogs/DebtPayments/EditDebtPaymentDialog";
import ConfirmDebtPaymentDialog from "@/components/ui/dialogs/DebtPayments/ConfirmDebtPaymentDialog";
import DeleteDebtPaymentDialog from "@/components/ui/dialogs/DebtPayments/DeleteDebtPaymentDialog";

type DataTableProps = {
  enableFilters?: boolean;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
  enableTypeFilter?: boolean;
  debtId?: string;
  enableUser?: boolean;
  userId?: string;
};

interface Filters {
  search?: string;
  status?: string;
}

export function DebtPaymentsDataTable({
  enableSearch = true,
  enableStatusFilter = true,
  debtId,
  enableUser = true,
  userId,
}: DataTableProps) {
  const t = useTranslations("DEBT_PAYMENTS");
  const monthsT = useTranslations("MONTHS");
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);

  const columnsString = () => {
    const columns = [
      { data: "date", name: "date", searchble: true },
      { data: "amount", name: "amount", searchble: true },
      { data: "userName", name: "userName", searchble: true },
      { data: "debtName", name: "debtName", searchble: true },
    ];

    const params = new URLSearchParams();

    columns.forEach((column, index) => {
      Object.entries(column).forEach(([key, value]) => {
        params.append(`columns[${index}][${key}]`, String(value));
      });
    });

    return params.toString();
  };

  const [isEditPaymentOpen, setIsEditPaymentOpen] = React.useState(false);
  const [isConfirmDialogOpen, setIsConfirmOpen] = React.useState(false);
  const [isDeletePaymentOpen, setIsDeletePaymentOpen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [total, setTotal] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState("");

  const { formData, setFormData, handleSubmit } = useDebtPaymentForm(selectedId);

  const extraParams = new URLSearchParams();
  if (userId) extraParams.append("userId", userId);
  if (debtId) extraParams.append("debtId", debtId);
  const extraOptString = extraParams.toString();

  const columnsQuery = React.useMemo(() => columnsString(), []);

  const sortingQuery = React.useMemo(
    () => sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    [sorting]
  );

  const [filters, setFilters] = React.useState<Filters>({});

  const url = React.useMemo(() => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([_, v]) => v !== null) as [string, string][]
    );

    return `/debt-payments?page=${pagination.pageIndex}&size=${pagination.pageSize}&sort=${sortingQuery}&${params.toString()}&${extraOptString}&${columnsQuery}`;
  }, [pagination, sortingQuery, filters, extraOptString, columnsQuery]);

  const {
    data: apiData,
    mutate,
    isLoading,
  } = useSWR(url ? [url, { method: "GET" }] : null, fetcher);

  React.useEffect(() => {
    if (apiData) {
      setPageCount(Math.ceil(apiData.recordsTotal / pagination.pageSize));
      setTotal(apiData.recordsTotal);
    }
  }, [apiData, pagination.pageSize]);

  const columns: ColumnDef<DebtPayment>[] = React.useMemo(
    () => [
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
            } as ColumnDef<DebtPayment>,
          ]
        : []),
      ...(!debtId
        ? [
            {
              accessorKey: "deb",
              header: t("DEBT"),
              cell: ({ row }) => (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-light text-md capitalize">{row.original.debtName}</span>
                  </div>
                </div>
              ),
            } as ColumnDef<DebtPayment>,
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
                <span className={`font-medium text-success-600`}>+ {t.amountFormated}</span>
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
                      onClick={async () => {
                        try {
                          setSelectedId(transaction.id);
                          setIsConfirmOpen(true);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      Confirmar Pagamento
                    </DropdownMenuItem>
                  )}
                  {transaction.actions?.view && (
                    <Link href={`/debt-payments/${transaction.id}`}>
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
                          interest_rate: transaction.interestRate.toString(),
                          is_monthly_payment: transaction.isMonthlyPayment,
                        });

                        setIsEditPaymentOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {transaction.actions?.destroy && (
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          setSelectedId(transaction.id);
                          setIsDeletePaymentOpen(true);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      variant="destructive"
                    >
                      Delete Payment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          );
        },
      },
    ],
    [enableUser, debtId, mutate, pagination]
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

  return (
    <div className="w-full bg-white rounded-sm border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Payments History</h2>
          <p className="text-sm text-muted-foreground">{total} total payments</p>
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
            <AppLink variant="default" path="/debt-payments/create">
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

      <EditDebtPaymentDialog
        isEditGoalOpen={isEditPaymentOpen}
        setIsEditGoalOpen={setIsEditPaymentOpen}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        mutate={mutate}
        formData={formData}
      />

      <DeleteDebtPaymentDialog
        isDeleteDialogOpen={isDeletePaymentOpen}
        setIsDeleteOpen={setIsDeletePaymentOpen}
        mutate={mutate}
        table={table}
        pagination={pagination}
        selectedId={selectedId}
      />

      <ConfirmDebtPaymentDialog
        setIsConfirmOpen={setIsConfirmOpen}
        isConfirmDialogOpen={isConfirmDialogOpen}
        mutate={mutate}
        selectedId={selectedId}
      />
    </div>
  );
}
