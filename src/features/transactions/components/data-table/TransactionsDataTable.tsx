"use client";

import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  Circle,
  CreditCard,
  Dot,
  ExternalLink,
  Landmark,
  MoreHorizontal,
  Pencil,
  PiggyBank,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Transaction,
  MyPagination,
  FormTransactionDialog,
  DeleteTransactionDialog,
  ConfirmTransactionDialog,
} from "@/features/transactions";
import { iconMap } from "@/shared/types/category";
import Link from "next/link";
import { cn, formatDate, getUserColor, getUserInitials } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMemo } from "react";
import { AccountType } from "@/features/accounts";
import DataTable from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";

type DataTableProps = {
  accountId?: string;
  enableUser?: boolean;
  userId?: string;
  pagination: MyPagination;
  data: {
    recordsTotal: number;
    data: Transaction[];
  };
  isLoading: boolean;
  mutate: () => void;
  setSorting: (updater: Updater<SortingState>) => void;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;

  setPagination: OnChangeFn<PaginationState>;
};

export function TransactionsDataTable({
  accountId,
  enableUser = true,
  pagination,
  data,
  isLoading,
  mutate,
  setSorting,
  columnFilters,
  setColumnFilters,
  setPagination,
  sorting,
}: DataTableProps) {
  const monthsT = useTranslations("MONTHS");
  const t = useTranslations("TRANSACTIONS");
  const [pageCount, setPageCount] = React.useState(0);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [isConfirmDialogOpen, setIsConfirmOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const [selectedId, setSelectedId] = React.useState<string>();
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (data) {
      setPageCount(Math.ceil(data.recordsTotal / pagination.pageSize));
      setTotal(data.recordsTotal);
    }
  }, [data, pagination.pageSize]);

  const columns = useMemo<ColumnDef<Transaction>[]>(() => {
    const accountTypeConfig: Record<
      AccountType,
      { icon: typeof Landmark; bg: string; text: string }
    > = {
      bank_account: { icon: Landmark, bg: "bg-blue-500/10", text: "text-blue-500" },
      cash: { icon: Wallet, bg: "bg-accent/10", text: "text-accent" },
      credit_card: { icon: CreditCard, bg: "bg-orange-500/10", text: "text-orange-500" },
      digital_wallet: { icon: PiggyBank, bg: "bg-violet-500/10", text: "text-violet-500" },
    };
    const AccountCell = ({ row }: { row: Row<Transaction> }) => {
      const t = row.original;
      const acctCfg = accountTypeConfig[t.accountType || "bank"];
      const AcctIcon = acctCfg.icon;

      return (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              acctCfg.bg
            )}
          >
            <AcctIcon className={cn("size-4", acctCfg.text)} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{t.accountName}</p>
            <p className="text-xs text-muted-foreground"> {t.accountTypeTranslated}</p>
          </div>
        </div>
      );
    };

    const AmountCell = ({ row }: { row: Row<Transaction> }) => {
      const t = row.original;
      const Icon = iconMap[t.categoryIcon as keyof typeof iconMap] ?? Circle;

      const isRevenue = t.type === "revenue";
      const isExpense = t.type === "expense";

      return (
        <div className="flex items-center gap-3">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${t.categoryColor}15`,
            }}
          >
            <Icon className="size-3.5" style={{ color: t.categoryColor }} />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm font-semibold tabular-nums",
                isRevenue && "text-accent",
                isExpense && "text-destructive",
                !isRevenue && !isExpense && "text-muted-foreground"
              )}
            >
              {t.amountFormated}
            </p>
            <p className="text-xs text-muted-foreground">{t.categoryName || "Uncategorized"}</p>
          </div>
        </div>
      );
    };

    const DateHeader = <TData,>({ column }: { column: Column<TData> }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("DATE")} <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
    const AmountHeader = <TData,>({ column }: { column: Column<TData> }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("AMOUNT")} <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );

    const StatusCell = ({ row }: { row: Row<Transaction> }) => (
      <Badge variant="outline" color={row.original.status === "pending" ? "warning" : "success"}>
        <Dot className="size-4" strokeWidth={6} />
        {row.original.statusTranslated}
      </Badge>
    );

    const ActionsCell = ({ transaction }: { transaction: Transaction }) => {
      if (!transaction.actions?.view) return null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">{t("ACTIONS")}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/accounts/${transaction.accountId}`}>
                <ExternalLink className="mr-2 size-4" />
                {t("VIEW_ACCOUNT")}
              </Link>
            </DropdownMenuItem>

            {transaction.actions.edit && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedId(transaction.id);
                  setIsEditOpen(true);
                }}
              >
                <Pencil className="mr-2 size-4" />
                {t("EDIT")}
              </DropdownMenuItem>
            )}

            {transaction.actions.confirm && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedId(transaction.id);
                  setIsConfirmOpen(true);
                }}
              >
                <Check className="mr-2 size-4" />
                {t("CONFIRM")}
              </DropdownMenuItem>
            )}

            {transaction.actions.destroy && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setSelectedId(transaction.id);
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 size-4" />
                  {t("DELETE")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    const baseColumns: ColumnDef<Transaction>[] = [
      {
        accessorKey: "amount",
        header: AmountHeader,
        cell: AmountCell,
      },
      {
        accessorKey: "date",
        header: DateHeader,
        cell: ({ row }) => formatDate(row.getValue("date"), monthsT),
      },
      {
        accessorKey: "description",
        header: t("DESCRIPTION"),
        cell: ({ row }) => (
          <div className="max-w-2xs whitespace-normal">{row.getValue("description")}</div>
        ),
      },
    ];

    const userColumn: ColumnDef<Transaction>[] = enableUser
      ? [
          {
            accessorKey: "user",
            header: t("USER"),
            cell: ({ row }) =>
              row.original.userName ? (
                <Avatar className={cn("size-8 ring-1", getUserColor(row.original.userName))}>
                  <AvatarFallback
                    className={cn("text-xs font-medium", getUserColor(row.original.userName))}
                  >
                    {getUserInitials(row.original.userName)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <span className="text-xs text-muted-foreground">-</span>
              ),
          },
        ]
      : [];

    const accountColumn: ColumnDef<Transaction>[] = !accountId
      ? [
          {
            accessorKey: "account",
            header: t("ACCOUNT"),
            cell: ({ row }) => <AccountCell row={row} />,
          },
        ]
      : [];

    return [
      ...accountColumn,
      ...baseColumns,
      {
        accessorKey: "status",
        header: t("STATUS"),
        cell: StatusCell,
      },
      ...userColumn,
      {
        id: "actions",
        cell: ({ row }) => <ActionsCell transaction={row.original} />,
      },
    ];
  }, [enableUser, accountId, monthsT, t]);

  const table = useReactTable({
    data: data?.data ?? [],
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

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full bg-white rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Tabela */}
        <DataTable
          table={table}
          isLoading={isLoading}
          columns={columns}
          nCols={accountId ? 6 : 7}
        />
      </div>

      <DataTablePagination
        table={table}
        pageCount={pageCount}
        total={total}
        pagination={pagination}
        t={t}
      />

      <FormTransactionDialog
        id={selectedId}
        setIsOpen={setIsEditOpen}
        isOpen={isEditOpen}
        mutate={mutate}
      />
      <DeleteTransactionDialog
        id={selectedId as string}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        table={table}
        pagination={pagination}
        mutate={mutate}
      />
      <ConfirmTransactionDialog
        id={selectedId as string}
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmOpen}
        mutate={mutate}
      />
    </div>
  );
}
