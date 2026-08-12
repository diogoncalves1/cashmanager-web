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
import { Check, Circle, Dot, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { accountTypeConfig } from "@/features/accounts";
import DataTable, { DataTableMeta } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { SortableColumnHeader } from "@/components/tables/SortableColumnHeader";

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

// Larguras fixas por coluna (px) — aplicadas diretamente no conteúdo da
// célula porque o size do columnDef do TanStack não é lido pelo DataTable atual.
const COLUMN_WIDTHS = {
  account: 220,
  amount: 220,
  date: 110,
  status: 130,
  user: 64,
  actions: 56,
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

  // Modal com os detalhes completos da transação
  const [detailsTransaction, setDetailsTransaction] = React.useState<Transaction | null>(null);

  React.useEffect(() => {
    if (data) {
      setPageCount(Math.ceil(data.recordsTotal / pagination.pageSize));
      setTotal(data.recordsTotal);
    }
  }, [data, pagination.pageSize]);

  const columns = useMemo<ColumnDef<Transaction>[]>(() => {
    // As células deixam de ter onClick/<button> próprio: o clique é tratado
    // pela TableRow inteira (ver DataTable.tsx), por isso aqui só há <div>s
    // com largura fixa para manter as colunas estáveis.

    const AccountCell = ({ row }: { row: Row<Transaction> }) => {
      const t = row.original;
      const acctCfg = accountTypeConfig[t.accountType || "bank"];
      const AcctIcon = acctCfg.icon;

      return (
        <div className="flex items-center gap-3" style={{ width: COLUMN_WIDTHS.account }}>
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
            <p className="truncate text-xs text-muted-foreground">{t.accountTypeTranslated}</p>
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
        <div className="flex items-center gap-3" style={{ width: COLUMN_WIDTHS.amount }}>
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
                "truncate text-sm font-semibold tabular-nums",
                isRevenue && "text-accent",
                isExpense && "text-destructive",
                !isRevenue && !isExpense && "text-muted-foreground"
              )}
            >
              {t.amountFormated}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {t.categoryName || "Uncategorized"}
            </p>
          </div>
        </div>
      );
    };

    const DateCell = ({ row }: { row: Row<Transaction> }) => (
      <div className="truncate text-sm" style={{ width: COLUMN_WIDTHS.date }}>
        {formatDate(row.getValue("date"), monthsT)}
      </div>
    );

    const DateHeader = <TData,>({ column }: { column: Column<TData> }) => (
      <SortableColumnHeader column={column}>{t("DATE")}</SortableColumnHeader>
    );
    const AmountHeader = <TData,>({ column }: { column: Column<TData> }) => (
      <SortableColumnHeader column={column}>{t("AMOUNT")}</SortableColumnHeader>
    );
    const AccountHeader = <TData,>({ column }: { column: Column<TData> }) => (
      <SortableColumnHeader column={column}>{t("ACCOUNT")}</SortableColumnHeader>
    );

    const StatusCell = ({ row }: { row: Row<Transaction> }) => (
      <div style={{ width: COLUMN_WIDTHS.status }}>
        <Badge variant="outline" color={row.original.status === "pending" ? "warning" : "success"}>
          <Dot className="size-4" strokeWidth={6} />
          {row.original.statusTranslated}
        </Badge>
      </div>
    );

    const UserCell = ({ row }: { row: Row<Transaction> }) => (
      <div className="flex" style={{ width: COLUMN_WIDTHS.user }}>
        {row.original.userName ? (
          <Avatar className={cn("size-8 ring-1", getUserColor(row.original.userName))}>
            <AvatarFallback
              className={cn("text-xs font-medium", getUserColor(row.original.userName))}
            >
              {getUserInitials(row.original.userName)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </div>
    );

    const ActionsCell = ({ transaction }: { transaction: Transaction }) => {
      if (!transaction.actions?.view) return null;

      return (
        <div style={{ width: COLUMN_WIDTHS.actions }}>
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
        </div>
      );
    };

    const baseColumns: ColumnDef<Transaction>[] = [
      {
        accessorKey: "amount",
        header: AmountHeader,
        cell: AmountCell,
        size: COLUMN_WIDTHS.amount,
      },
      {
        accessorKey: "date",
        header: DateHeader,
        cell: DateCell,
        size: COLUMN_WIDTHS.date,
      },
      // description removida da tabela — agora só aparece no modal de detalhes
    ];

    const userColumn: ColumnDef<Transaction>[] = enableUser
      ? [
          {
            accessorKey: "user",
            header: t("USER"),
            cell: UserCell,
            size: COLUMN_WIDTHS.user,
          },
        ]
      : [];

    const accountColumn: ColumnDef<Transaction>[] = !accountId
      ? [
          {
            accessorKey: "account",
            header: AccountHeader,
            cell: ({ row }) => <AccountCell row={row} />,
            size: COLUMN_WIDTHS.account,
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
        size: COLUMN_WIDTHS.status,
      },
      ...userColumn,
      {
        id: "actions",
        cell: ({ row }) => <ActionsCell transaction={row.original} />,
        size: COLUMN_WIDTHS.actions,
      },
    ];
  }, [enableUser, accountId, monthsT, t]);

  const tableMeta: DataTableMeta<Transaction> = {
    onRowClick: (transaction) => setDetailsTransaction(transaction),
  };

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
    meta: tableMeta,
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
      <div className="w-full dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Tabela */}
        <DataTable table={table} isLoading={isLoading} columns={columns} />
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

      {/* Modal com todos os detalhes da transação */}
      <Dialog
        open={!!detailsTransaction}
        onOpenChange={(open) => !open && setDetailsTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("TRANSACTION_DETAILS") ?? t("DESCRIPTION")}</DialogTitle>
          </DialogHeader>

          {detailsTransaction && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("AMOUNT")}</span>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    detailsTransaction.type === "revenue" && "text-accent",
                    detailsTransaction.type === "expense" && "text-destructive"
                  )}
                >
                  {detailsTransaction.amountFormated}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("DATE")}</span>
                <span className="text-sm">{formatDate(detailsTransaction.date, monthsT)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("STATUS")}</span>
                <Badge
                  variant="outline"
                  color={detailsTransaction.status === "pending" ? "warning" : "success"}
                >
                  <Dot className="size-4" strokeWidth={6} />
                  {detailsTransaction.statusTranslated}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("ACCOUNT")}</span>
                <span className="text-sm">{detailsTransaction.accountName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("CATEGORY") ?? "Categoria"}
                </span>
                <span className="text-sm">
                  {detailsTransaction.categoryName || "Uncategorized"}
                </span>
              </div>

              {detailsTransaction.userName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("USER")}</span>
                  <div className="flex items-center gap-2">
                    <Avatar
                      className={cn("size-6 ring-1", getUserColor(detailsTransaction.userName))}
                    >
                      <AvatarFallback
                        className={cn(
                          "text-[10px] font-medium",
                          getUserColor(detailsTransaction.userName)
                        )}
                      >
                        {getUserInitials(detailsTransaction.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{detailsTransaction.userName}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1 border-t pt-4">
                <span className="text-sm text-muted-foreground">{t("DESCRIPTION")}</span>
                <p className="whitespace-pre-wrap break-words text-sm text-foreground">
                  {detailsTransaction.description || "-"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
