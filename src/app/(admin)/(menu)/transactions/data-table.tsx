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
import { ArrowUpDown, ChevronDown, Dot, Edit3, Eye, Plus, Trash2 } from "lucide-react";
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
import { onDeleteAccount } from "@/services/accounts/service";
import * as LucideIcons from "lucide-react";
import { Transaction, transactionStatus, transactionTypes } from "@/lib/models/transaction";
import { LucideTrendingUp, LucideTrendingDown, Circle, Activity } from "lucide-react";
import { onConfirmTransaction, onDeleteTransaction } from "@/services/transactions/service";

const TypeIcons = {
  revenue: <LucideTrendingUp className="w-5 h-5" />,
  expense: <LucideTrendingDown className="w-5 h-5" />,
  none: <Circle className="w-5 h-5" />,
};
const AccountTypeIcons = {
  bank_account: <LucideIcons.Building2Icon className="w-12" />,
  cash: <LucideIcons.Banknote className="w-12" />,
  digital_wallet: <LucideIcons.Wallet className="w-12" />,
  credit_card: <LucideIcons.CreditCard className="w-12" />,
  none: "",
};

type DataTableProps = {
  enableFilters?: boolean;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
  enableTypeFilter?: boolean;
  accountId?: string;
  enableUser?: boolean;
  userId?: string;
};

export function TransactionsDataTable({
  enableFilters = true,
  enableSearch = true,
  enableStatusFilter = true,
  enableTypeFilter = true,
  accountId,
  enableUser = true,
  userId,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  const columnsString = () => {
    const columns = [
      { data: "date", name: "date", searchable: true },
      { data: "amount", name: "amount", searchable: true },
      { data: "userName", name: "userName", searchable: true },
      { data: "accountName", name: "accountName", searchable: true },
      { data: "categoryName", name: "categoryName", searchable: true },
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

  const sortingString = sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");

  const filterString = columnFilters
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

  const extraParams = new URLSearchParams();
  if (userId) extraParams.append("userId", userId);
  if (accountId) extraParams.append("accountId", accountId);
  const extraOptString = extraParams.toString();

  const url = `/transactions?page=${pagination.pageIndex}&size=${
    pagination.pageSize
  }&sort=${sortingString}&${filterString}&${extraOptString}&${columnsString()}`;

  const getPageNumbers = () => {
    const totalPages = pageCount;
    const current = pagination.pageIndex + 1; // 1-based
    const delta = 2; // quantas páginas mostrar de cada lado

    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const {
    data: apiData,
    mutate,
    isLoading,
  } = useSWR(url ? [url, { method: "GET" }] : null, fetcher);

  // Atualiza dados e total de páginas
  React.useEffect(() => {
    if (apiData) {
      setPageCount(Math.ceil(apiData.recordsTotal / pagination.pageSize));
    }
  }, [apiData, pagination.pageSize]);

  // Colunas base (sem ações ainda)
  const columns: ColumnDef<Transaction>[] = React.useMemo(
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
          const Icon = LucideIcons[t.categoryIcon ?? "Circle"] as any;
          return (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <Icon className="h-5 w-5" style={{ color: t.categoryColor }} />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-medium ${
                    t.type === "revenue" ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {t.type === "revenue" ? "+" : "-"} {t.amountFormated}
                </span>
                <span className="text-xs text-muted-foreground">{t.categoryName}</span>
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
            } as ColumnDef<Transaction>,
          ]
        : []),
      ...(!accountId
        ? [
            {
              accessorKey: "account",
              header: "Account",
              cell: ({ row }) => (
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-success-600 justify-center w-10 h-10 rounded-full bg-muted">
                    {AccountTypeIcons[row.original.accountType]}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-light text-md capitalize">
                      {row.original.accountName}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {row.original.accountTypeTranslated}
                    </span>
                  </div>
                </div>
              ),
            } as ColumnDef<Transaction>,
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
                        onConfirmTransaction(transaction.id, mutate);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="bg-success-100  text-success-500 hover:bg-success-500 hover:text-white ms-1"
                    size={"icon-sm"}
                    variant={"ghost"}
                  >
                    <LucideIcons.CheckCircle2 />
                  </Button>
                )}
                {transaction.actions?.view && (
                  <AppLink
                    path={`/transactions/${transaction.id}`}
                    className="bg-blue-100  text-blue-500 hover:bg-blue-500 hover:text-white ms-1"
                    size={"icon-sm"}
                    variant={"ghost"}
                  >
                    <Eye />
                  </AppLink>
                )}
                {transaction.actions?.edit && (
                  <AppLink
                    path={`/transactions/${transaction.id}/edit`}
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
                        onDeleteTransaction(transaction.id, table, pagination, mutate);
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
    [enableUser]
  );

  // Tabela com paginação manual
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
    onPaginationChange: setPagination, // ← Crucial!
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

  // Atualiza colunas da tabela
  React.useEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      columns,
    }));
  }, [table, columns]);

  return (
    <div className="w-full bg-white rounded-sm border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      {enableFilters && (
        <div className="border-b p-4">
          <div className="grid grid-cols-12 gap-4">
            {enableSearch && (
              <div className="col-span-12 md:col-span-4">
                <Input
                  placeholder="Pesquisar..."
                  value={(table.getColumn("search")?.getFilterValue() as any)?.value ?? ""}
                  onChange={(e) =>
                    table.getColumn("search")?.setFilterValue({ value: e.target.value })
                  }
                />
              </div>
            )}

            <div className="col-span-12 md:col-span-5 flex items-center gap-3">
              <span className="text-sm">Filtrar por:</span>
              {enableStatusFilter && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Activity className="mr-2 h-4 w-4" />
                      {transactionStatus.find(
                        (s) => s.value === table.getColumn("status")?.getFilterValue()
                      )?.label ?? "Status"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                    >
                      Todos
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

              {/* Type Filter */}
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
                      )?.label ?? "Tipo"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => table.getColumn("type")?.setFilterValue(undefined)}
                    >
                      <Circle className="mr-2 h-4 w-4" /> Todos
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
                path="/transactions/create"
                className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm gap-2"
              >
                <Plus className="size-5" />
                Adicionar
              </AppLink>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
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
                Carregando...
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
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginação */}
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {apiData?.recordsTotal ?? 0} transações
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            Primeira
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          {/* Números de página */}
          <div className="hidden sm:flex items-center gap-1 mx-2">
            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <Button
                  key={page}
                  variant={page === pagination.pageIndex + 1 ? "default" : "outline"}
                  size="sm"
                  className="min-w-[36px]"
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </Button>
              ) : (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  {page}
                </span>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            Última
          </Button>
        </div>
      </div>
    </div>
  );
}
