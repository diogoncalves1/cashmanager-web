"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Check, Dot, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { SortableColumnHeader } from "@/components/tables/SortableColumnHeader";
import { cn, formatDate, getUserColor, getUserInitials } from "@/shared/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import DataTable, { DataTableMeta } from "@/components/tables/DataTable";
import {
  MyPagination,
  FormPaymentDialog,
  DebtPayment,
  ConfirmPaymentDialog,
  DeletePaymentDialog,
} from "@/features/debt-payments";

type DataTableProps = {
  debtId?: string;
  enableUser?: boolean;
  userId?: string;
  pagination: MyPagination;
  data: {
    recordsTotal: number;
    data: DebtPayment[];
  };
  isLoading: boolean;
  mutate: () => void;
  setSorting: (updater: Updater<SortingState>) => void;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;

  setPagination: OnChangeFn<PaginationState>;
};

export function DebtPaymentsDataTable({
  debtId,
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
  const t = useTranslations("DEBT_PAYMENTS");
  const [pageCount, setPageCount] = React.useState(0);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [isConfirmDialogOpen, setIsConfirmOpen] = React.useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = React.useState(false);
  const [isDeleteGoalOpen, setIsDeleteGoalOpen] = React.useState(false);

  const [selectedId, setSelectedId] = React.useState<string>();
  const [detailsPayment, setDetailsPayment] = React.useState<DebtPayment | null>(null);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (data) {
      setPageCount(Math.ceil(data.recordsTotal / pagination.pageSize));
      setTotal(data.recordsTotal);
    }
  }, [data, pagination.pageSize]);

  const columns: ColumnDef<DebtPayment>[] = React.useMemo(
    () => [
      ...(!debtId
        ? [
            {
              accessorKey: "debt",
              header: ({ column }) => (
                <SortableColumnHeader column={column}>{t("DEBT")}</SortableColumnHeader>
              ),
              cell: ({ row }) => (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium capitalize text-foreground">
                      {row.original.debtName}
                    </span>
                  </div>
                </div>
              ),
            } as ColumnDef<DebtPayment>,
          ]
        : []),
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <SortableColumnHeader column={column}>{t("AMOUNT")}</SortableColumnHeader>
        ),
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-semibold tabular-nums text-foreground">
                  {payment.amountFormated}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <SortableColumnHeader column={column}>{t("DATE")}</SortableColumnHeader>
        ),
        cell: ({ row }) => formatDate(row.original.date, monthsT),
      },
      {
        accessorKey: "status",
        header: t("STATUS"),
        cell: ({ row }) => (
          <Badge color={row.original.status == "pending" ? "warning" : "success"}>
            <Dot className="size-4" strokeWidth={6} />
            {row.original.statusTranslated}
          </Badge>
        ),
      },
      ...(enableUser
        ? [
            {
              accessorKey: "user",
              header: t("USER"),
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <Avatar className={cn("size-8 ring-1", getUserColor(row.original.userName))}>
                    <AvatarFallback
                      className={cn("text-xs font-medium", getUserColor(row.original.userName))}
                    >
                      {getUserInitials(row.original.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium text-foreground">
                    {row.original.userName}
                  </span>
                </div>
              ),
            } as ColumnDef<DebtPayment>,
          ]
        : []),
      {
        id: "actions",
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="app"
                    size="icon-sm"
                    className="shadow-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 bg-card">
                  {payment.actions?.confirm && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedId(payment.id);
                        setIsConfirmOpen(true);
                      }}
                    >
                      <Check className="mr-2 size-4" />
                      {t("CONFIRM_PAYMENT")}
                    </DropdownMenuItem>
                  )}
                  {payment.actions?.view && (
                    <Link href={`/debts/${payment.debtId}`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 size-4" />
                        {t("VIEW_DEBT")}
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {payment.actions?.edit && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedId(payment.id);
                        setIsEditGoalOpen(true);
                      }}
                    >
                      <Edit className="mr-2 size-4" />
                      {t("EDIT")}
                    </DropdownMenuItem>
                  )}
                  {payment.actions?.destroy && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          setSelectedId(payment.id);
                          setIsDeleteGoalOpen(true);
                        }}
                        variant="destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        {t("DELETE")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          );
        },
      },
    ],
    [enableUser, debtId, monthsT, t]
  );

  const tableMeta: DataTableMeta<DebtPayment> = {
    onRowClick: (payment) => setDetailsPayment(payment),
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
      <div className="w-full overflow-hidden rounded-md border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
        <DataTable table={table} columns={columns} isLoading={isLoading} />
      </div>
      <DataTablePagination
        table={table}
        pageCount={pageCount}
        total={total}
        pagination={pagination}
        t={t}
      />

      {/* <FormDebtPaymentDialog /> */}

      <FormPaymentDialog
        isOpen={isEditGoalOpen}
        setIsOpen={setIsEditGoalOpen}
        mutate={mutate}
        id={selectedId}
      />

      <DeletePaymentDialog
        isDeleteDialogOpen={isDeleteGoalOpen}
        setIsDeleteOpen={setIsDeleteGoalOpen}
        mutate={mutate}
        table={table}
        pagination={pagination}
        selectedId={selectedId as string}
      />

      <ConfirmPaymentDialog
        setIsConfirmOpen={setIsConfirmOpen}
        isConfirmDialogOpen={isConfirmDialogOpen}
        mutate={mutate}
        selectedId={selectedId as string}
      />

      <Dialog open={!!detailsPayment} onOpenChange={(open) => !open && setDetailsPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("PAYMENT_DETAILS")}</DialogTitle>
          </DialogHeader>

          {detailsPayment && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("AMOUNT")}</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {detailsPayment.amountFormated}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("INTEREST_PAID")}</span>
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {detailsPayment.interestPaidFormated}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("DATE")}</span>
                <span className="text-sm">{formatDate(detailsPayment.date, monthsT)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("STATUS")}</span>
                <Badge color={detailsPayment.status === "pending" ? "warning" : "success"}>
                  <Dot className="size-4" strokeWidth={6} />
                  {detailsPayment.statusTranslated}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("DEBT")}</span>
                <span className="text-sm font-medium text-foreground">
                  {detailsPayment.debtName}
                </span>
              </div>

              {detailsPayment.userName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("USER")}</span>
                  <div className="flex items-center gap-2">
                    <Avatar className={cn("size-6 ring-1", getUserColor(detailsPayment.userName))}>
                      <AvatarFallback
                        className={cn(
                          "text-[10px] font-medium",
                          getUserColor(detailsPayment.userName)
                        )}
                      >
                        {getUserInitials(detailsPayment.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{detailsPayment.userName}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1 border-t pt-4">
                <span className="text-sm text-muted-foreground">{t("DESCRIPTION")}</span>
                <p className="whitespace-pre-wrap break-words text-sm text-foreground">
                  {detailsPayment.description || "-"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
