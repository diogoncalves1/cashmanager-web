"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Activity,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Circle,
  Dot,
  Edit3,
  Eye,
  LucideTrendingDown,
  LucideTrendingUp,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Badge from "@/components/ui/badge/Badge";
import { AppLink } from "@/components/ui/button/AppLink";
import { iconMap } from "@/lib/models/category";
import { useTranslations } from "next-intl";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import {
  FinancialGoalTransaction,
  financialGoalTransactionStatus,
  financialGoalTransactionTypes,
} from "@/lib/models/financialGoalTransactions";
import {
  onConfirmFinancialGoalTransaction,
  onDeleteFinancialGoalTransaction,
} from "@/services/financial-goal-transactions/service";

const TypeIcons = {
  contribution: <LucideTrendingUp className="w-5 h-5" />,
  withdrawal: <LucideTrendingDown className="w-5 h-5" />,
  none: <Circle className="w-5 h-5" />,
};

type DataTableProps = {
  enableFilters?: boolean;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
  enableTypeFilter?: boolean;
  financialGoalId?: string;
  enableUser?: boolean;
  userId?: string;
};

export function FinancialGoalTransactionsDataTable({
  enableFilters = true,
  enableSearch = true,
  enableStatusFilter = true,
  enableTypeFilter = true,
  financialGoalId,
  enableUser = true,
  userId,
}: DataTableProps) {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
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
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = React.useState(0);

  const extraParams = new URLSearchParams();
  if (userId) extraParams.append("userId", userId);
  if (financialGoalId) extraParams.append("financialGoalId", financialGoalId);
  const extraOptString = extraParams.toString();

  const columnsQuery = React.useMemo(() => columnsString(), []);

  const sortingQuery = React.useMemo(
    () => sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    [sorting]
  );

  const filterQuery = React.useMemo(() => {
    return columnFilters
      .map((f: any) => {
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
    return `/financial-goal-transactions?page=${pagination.pageIndex}&size=${pagination.pageSize}&sort=${sortingQuery}&${filterQuery}&${extraOptString}&${columnsQuery}`;
  }, [pagination, sortingQuery, filterQuery, extraOptString, columnsQuery]);

  const {
    data: apiData,
    mutate,
    isLoading,
  } = useSWR(url ? [url, { method: "GET" }] : null, fetcher);

  React.useEffect(() => {
    if (apiData) {
      setPageCount(Math.ceil(apiData.recordsTotal / pagination.pageSize));
    }
  }, [apiData, pagination.pageSize]);

  const columns: ColumnDef<FinancialGoalTransaction>[] = React.useMemo(
    () => [
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
          const Icon = iconMap[t.type == "contribution" ? "TrendingUp" : "TrendingDown"] || Circle;
          return (
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  t.type === "contribution" ? "bg-success-100" : "bg-error-100"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    t.type === "contribution" ? "text-success-600" : "text-error-600"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-medium ${
                    t.type === "contribution" ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {t.type === "contribution" ? "+" : "-"} {t.amountFormated}
                </span>
                <span className="text-xs text-muted-foreground">{t.typeTranslated}</span>
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
            Date <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("date")}</span>
          </div>
        ),
      },
      ...(enableUser
        ? [
            {
              accessorKey: "user",
              header: "User",
              cell: ({ row }) => <div className="font-medium">{row.original.userName}</div>,
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
                  <div className="flex items-center text-success-600 justify-center w-10 h-10 rounded-full bg-muted">
                    <Target className="w-12" />
                  </div>

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
        accessorKey: "search",
        header: () => null,
        cell: () => null,
        enableHiding: true,
      },
      {
        accessorKey: "type",
        header: () => null,
        cell: () => null,
        enableHiding: true,
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
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            transaction.actions?.view && (
              <>
                {transaction.actions?.confirm && (
                  <Button
                    onClick={async () => {
                      try {
                        onConfirmFinancialGoalTransaction(transaction.id, mutate);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="bg-success-100  text-success-500 hover:bg-success-500 hover:text-white ms-1"
                    size={"icon-sm"}
                    variant={"ghost"}
                  >
                    <CheckCircle2 />
                  </Button>
                )}
                {transaction.actions?.view && (
                  <AppLink
                    path={`/financial-goal-transactions/${transaction.id}`}
                    className="bg-blue-100  text-blue-500 hover:bg-blue-500 hover:text-white ms-1"
                    size={"icon-sm"}
                    variant={"ghost"}
                  >
                    <Eye />
                  </AppLink>
                )}
                {transaction.actions?.edit && (
                  <AppLink
                    path={`/financial-goal-transactions/${transaction.id}/edit`}
                    className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white ms-1"
                    size={"icon-sm"}
                    variant={"ghost"}
                  >
                    <Edit3 />
                  </AppLink>
                )}
                {transaction.actions?.destroy && (
                  <Button
                    className="bg-error-100 text-error-500 hover:bg-error-500 hover:text-white ms-1"
                    size={"icon-sm"}
                    variant={"ghost"}
                    onClick={async () => {
                      try {
                        onDeleteFinancialGoalTransaction(transaction.id, table, pagination, mutate);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    <Trash2 />
                  </Button>
                )}
              </>
            )
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

  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => {
      table.getColumn("search")?.setFilterValue({ value: search });
    }, 400);

    return () => clearTimeout(t);
  }, [search, table]);

  return (
    <div className="w-full bg-white rounded-sm border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      {enableFilters && (
        <div className="border-b p-4">
          <div className="grid grid-cols-12 gap-4">
            {enableSearch && (
              <div className="col-span-12 md:col-span-4">
                <Input
                  placeholder={`${t("SEARCH")}...`}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}

            <div className="col-span-12 md:col-span-5 flex items-center gap-3">
              <span className="text-sm">{t("FILTER_BY")}:</span>
              {enableStatusFilter && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Activity className="mr-2 h-4 w-4" />
                      {transactionStatus.find(
                        (s) => s.value === table.getColumn("status")?.getFilterValue()
                      )?.label ?? t("STATUS")}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                    >
                      {t("ALL")}
                    </DropdownMenuItem>
                    {transactionStatus.map((s) => (
                      <DropdownMenuItem
                        key={s.value}
                        onClick={() => table.getColumn("status")?.setFilterValue(s.value)}
                      >
                        {s.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {enableTypeFilter && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {
                        TypeIcons[
                          (table.getColumn("type")?.getFilterValue() as keyof typeof TypeIcons) ||
                            "none"
                        ]
                      }
                      {transactionTypes.find(
                        (t) => t.value === table.getColumn("type")?.getFilterValue()
                      )?.label ?? t("TYPE")}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => table.getColumn("type")?.setFilterValue(undefined)}
                    >
                      <Circle className="mr-2 h-4 w-4" /> {t("ALL")}
                    </DropdownMenuItem>
                    {transactionTypes.map((t) => (
                      <DropdownMenuItem
                        key={t.value}
                        onClick={() => table.getColumn("type")?.setFilterValue(t.value)}
                      >
                        {TypeIcons[t.value as keyof typeof TypeIcons]} {t.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="col-span-12 md:col-span-3 text-end">
              <AppLink
                variant="default"
                path="/financial-goal-transactions/create"
                className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm gap-2"
              >
                <Plus className="size-5" />
                {t("ADD")}
              </AppLink>
            </div>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(
                (header) =>
                  header.column.getIsVisible() && (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t("LOADING")}...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t("NO_RESULTS")}.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} pageCount={pageCount} pagination={pagination} t={t} />
    </div>
  );
}
