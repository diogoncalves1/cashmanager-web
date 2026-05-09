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
import { ArrowUpDown, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn, formatDate, getUserColor, getUserInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import DataTable from "@/components/tables/DataTable";
import { MyPagination } from "@/features/debt-payments/components/containers/TableContainer";
import { DebtPayment } from "@/features/debt-payments/types/index";
import ConfirmPaymentDialog from "@/features/debt-payments/components/dialogs/ConfirmPaymentDialog";
import DeletePaymentDialog from "@/features/debt-payments/components/dialogs/DeletePaymentDialog";
import FormPaymentDialog from "@/features/debt-payments/components/dialogs/FormPaymentDialog";

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
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("AMOUNT")} <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className={`font-medium`}>{t.amountFormated}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "interestPaid",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("INTEREST_PAID")} <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className={`font-medium`}>{t.interestPaidFormated}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("DATE")} <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.date, monthsT),
      },
      {
        accessorKey: "description",
        header: t("DESCRIPTION"),
        cell: ({ row }) => (
          <div className="max-w-2xs whitespace-normal">{row.getValue("description")}</div>
        ),
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
                  {payment.actions?.confirm && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedId(payment.id);
                        setIsConfirmOpen(true);
                      }}
                    >
                      {t("CONFIRM_PAYMENT")}
                    </DropdownMenuItem>
                  )}
                  {payment.actions?.view && (
                    <Link href={`/debts/${payment.debtId}`}>
                      <DropdownMenuItem>{t("VIEW_DEBT")}</DropdownMenuItem>
                    </Link>
                  )}
                  {payment.actions?.edit && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedId(payment.id);
                        setIsEditGoalOpen(true);
                      }}
                    >
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
      <div className="w-full bg-white rounded-sm border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
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
    </div>
  );
}
