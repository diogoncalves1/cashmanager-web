"use client";

import * as React from "react";
import {
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
  ChevronDown,
  Circle,
  Dot,
  Edit3,
  Eye,
  LucideTrendingDown,
  LucideTrendingUp,
  Plus,
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
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { AppLink } from "@/components/ui/button/AppLink";
import { onDeleteAccount } from "@/services/accounts/service";
import * as LucideIcons from "lucide-react";
import { Transaction, transactionStatus, transactionTypes } from "@/lib/models/transaction";

const TypeIcons = {
  revenue: <LucideTrendingUp className="w-12" />,
  expense: <LucideTrendingDown className="w-12" />,
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
  const [data, setData] = React.useState<Transaction[]>([]);
  const pagination = {
    pageIndex: 0,
    pageSize: 10,
  };
  const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: "date" }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageCount, setPageCount] = React.useState(0);
  const sortingString = sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");

  const filterString = columnFilters
    .map(function (f) {
      const params = new URLSearchParams();

      const filterObj = { [f.id]: f.value };

      Object.entries(filterObj).forEach(([key, val]) => {
        if (typeof val === "object") {
          Object.entries(val).forEach(([k, v]) => {
            params.append(`${key}[${k}]`, v as string);
          });
        } else {
          params.append(key, val as string);
        }
      });

      const queryString = params.toString();

      return queryString;
    })
    .join("&");

  const extraOpt = [];
  if (userId) {
    extraOpt.push({ id: "userId", value: userId });
  }
  if (accountId) {
    extraOpt.push({ id: "accountId", value: accountId });
  }

  const extraOptString = extraOpt
    .map(function (f) {
      const params = new URLSearchParams();

      const filterObj = { [f.id]: f.value };

      Object.entries(filterObj).forEach(([key, val]) => {
        if (typeof val === "object") {
          Object.entries(val).forEach(([k, v]) => {
            params.append(`${key}[${k}]`, v as string);
          });
        } else {
          params.append(key, val as string);
        }
      });

      const queryString = params.toString();

      return queryString;
    })
    .join("&");

  var columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const transaction = row.original;

        const Icon = LucideIcons[transaction.categoryIcon ?? "Eye"];
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center  justify-center w-10 h-10 rounded-full bg-muted">
              <Icon style={{ color: transaction.categoryColor }} />
            </div>

            <div className="flex flex-col">
              <span
                className={`font-light text-md ${
                  transaction.type == "revenue" ? "text-success-600" : "text-error-600"
                } capitalize`}
              >
                {transaction.type == "revenue" ? "+" : "-"} {transaction.amountFormated}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {transaction.categoryName}
              </span>
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
          Date <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-light text-md capitalize">{row.getValue("date")}</span>
            <span className="text-xs text-muted-foreground capitalize">{row.original.date}</span>
          </div>
        </div>
      ),
    },
  ];

  if (enableUser) {
    columns = [
      ...columns,
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
          return <div className="flex -space-x-2">{row.original.userName}</div>;
        },
      },
    ];
  }
  columns = [
    ...columns,
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
        <Badge type="rounded" size="sm" color={row.getValue("status") ? "success" : "error"}>
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
                      onDeleteAccount(transaction.id, table, pagination, mutate);
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
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const {
    data: apiData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [
      `/transactions?page=${pagination.pageIndex}&size=${pagination.pageSize}&sort=${sortingString}&${filterString}&${extraOptString}`,
      { method: "GET" },
    ],
    fetcher
  );

  React.useEffect(() => {
    if (apiData) {
      setData(apiData.data);
      setPageCount(apiData.recordsTotal);
    }
  }, [apiData]);

  if (isLoading) return <></>;

  return (
    <div className="w-full bg-white rounded-sm  border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      {enableFilters && (
        <div className="border-b items-center p-4 py-4">
          <div className="w-full grid grid-cols-12 justify-between gap-4">
            {enableSearch && (
              <div className="col-span-12 md:col-span-3">
                <Input
                  placeholder="Search ..."
                  value={(table.getColumn("search")?.getFilterValue()?.value as string) ?? ""}
                  onChange={(event) => {
                    table
                      .getColumn("search")
                      ?.setFilterValue({ value: event.target.value, regex: event.target.value });
                  }}
                  className=" md:max-w-xs"
                />
              </div>
            )}
            <div className="col-span-12 text-center md:col-span-6 justify-center items-center flex gap-2">
              <p className="mr-2 text-sm ">Filtra por:</p>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto text-gray-dark font-light">
                      <Activity className="mr-auto" />
                      {transactionStatus.find(
                        (status) => status.value == table.getColumn("status")?.getFilterValue()
                      )?.label ?? "Status"}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      key="all"
                      className="capitalize"
                      defaultValue={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                      onClick={() => {
                        table.getColumn("status")?.setFilterValue(null);
                      }}
                    >
                      Status
                    </DropdownMenuItem>
                    {transactionStatus.map((status) => {
                      return (
                        <DropdownMenuItem
                          key={status.value}
                          className="capitalize"
                          defaultValue={
                            (table.getColumn("status")?.getFilterValue() as string) ?? ""
                          }
                          onClick={() => {
                            table.getColumn("status")?.setFilterValue(status.value);
                          }}
                        >
                          {status.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto  text-gray-dark font-light">
                      {TypeIcons[(table.getColumn("type")?.getFilterValue() as string) ?? "none"]}
                      {transactionTypes.find(
                        (type) =>
                          type.value == (table.getColumn("type")?.getFilterValue() as string)
                      )?.label ?? (
                        <>
                          <Circle /> Tipo
                        </>
                      )}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      key="all"
                      className="capitalize"
                      defaultValue={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
                      onClick={() => {
                        table.getColumn("type")?.setFilterValue(null);
                      }}
                    >
                      <Circle /> Tipo
                    </DropdownMenuItem>
                    {transactionTypes.map((type) => {
                      return (
                        <DropdownMenuItem
                          key={type.value}
                          className="capitalize"
                          defaultValue={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
                          onClick={() => {
                            table.getColumn("type")?.setFilterValue(type.value);
                          }}
                        >
                          {TypeIcons[type.value]}
                          {type.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className={`col-span-12 md:col-span-3 md:text-end`}>
              <AppLink
                variant="default"
                path="/accounts/create"
                className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm gap-2"
              >
                <Plus className="size-5" />
                Adicionar
              </AppLink>
            </div>
          </div>
        </div>
      )}
      <Table className="border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return header.column.getIsVisible() ? (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ) : null;
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex p-4 items-center justify-end space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          A mostrar {table.getRowCount()} de {pageCount} transações.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              pagination.pageIndex--;
            }}
            disabled={pagination.pageIndex == 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              pagination.pageIndex++;
            }}
            disabled={pagination.pageIndex >= Math.floor((pageCount - 1) / pagination.pageSize)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
