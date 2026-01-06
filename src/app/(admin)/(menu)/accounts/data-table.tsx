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
import { Activity, ChevronDown, Circle, Dot, Edit3, Eye, Plus, Trash2 } from "lucide-react";
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
import { Account, AccountType, accountTypes } from "@/lib/models/account";
import { useTranslations } from "next-intl";
import { TypeIcons } from "@/components/accouts/TypeIcons";

export function DataTable() {
  const t = useTranslations("ACCOUNTS");

  const accountStatus = [
    {
      value: "active",
      label: "Active",
    },
    {
      value: "inactive",
      label: "Inactive",
    },
  ];

  const [data, setData] = React.useState<Account[]>([]);
  const pagination = {
    pageIndex: 0,
    pageSize: 10,
  };
  const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: "name" }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageCount, setPageCount] = React.useState(0);
  const sortingString = sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");
  const filterString = columnFilters
    .map((f) => `${f.id}=${encodeURIComponent(f.value as string)}`)
    .join("&");

  const columns: ColumnDef<Account>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center text-success-600 justify-center w-10 h-10 rounded-full bg-muted">
            {TypeIcons[row.original.type]}
          </div>

          <div className="flex flex-col">
            <span className="font-light text-md capitalize">{row.getValue("name")}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {row.original.typeTranslated}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-light text-left px-4 py-2 has-[>svg]:px-3">
            {row.original.balanceFormated}
          </div>
        );
      },
    },
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
      accessorKey: "users",
      header: "Users",
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex -space-x-2">
            {account.users?.map((user, index) => (
              <div
                key={index}
                className="
        relative group
        size-6
        rounded-full bg-blue-100
        flex items-center justify-center
        text-xs font-medium text-blue-700
        cursor-default
        transition-all duration-200
        hover:z-20 hover:scale-110
      "
              >
                {user.name.charAt(0)}

                {/* Tooltip */}
                <div
                  className="
          pointer-events-none
          absolute bottom-full left-1/2
          z-30
          mb-2
          w-max
          -translate-x-1/2
          rounded-md bg-gray-900
          px-2 py-1
          text-xs text-white
          opacity-0 scale-95
          transition-all duration-200 ease-out
          group-hover:opacity-100 group-hover:scale-100
        "
                >
                  {user.name}

                  {/* Arrow */}
                  <div className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-gray-900" />
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const account = row.original;
        return (
          account.actions?.view && (
            <>
              {account.actions?.view && (
                <AppLink
                  path={`accounts/${account.id}`}
                  className="bg-blue-100  text-blue-500 hover:bg-blue-500 hover:text-white ms-1"
                  size={"icon-sm"}
                  variant={"ghost"}
                >
                  <Eye />
                </AppLink>
              )}
              {account.actions?.edit && (
                <AppLink
                  path={`accounts/${account.id}/edit`}
                  className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white ms-1"
                  size={"icon-sm"}
                  variant={"ghost"}
                >
                  <Edit3 />
                </AppLink>
              )}
              {account.actions?.destroy && (
                <Button
                  className="bg-error-100 text-error-500 hover:bg-error-500 hover:text-white ms-1"
                  size={"icon-sm"}
                  variant={"ghost"}
                  onClick={async () => {
                    try {
                      onDeleteAccount(account.id, table, pagination, mutate);
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
      `/accounts?page=${pagination.pageIndex}&size=${pagination.pageSize}&sort=${sortingString}&${filterString}`,
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

  return (
    <div className="w-full bg-white rounded-sm shadow-md  border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b items-center p-4 py-4">
        <div className="w-full grid grid-cols-12 justify-between gap-4">
          <div className="col-span-12 md:col-span-3">
            <Input
              placeholder="Search ..."
              value={(table.getColumn("search")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
                table.getColumn("balance")?.setFilterValue(event.target.value);
                table.getColumn("search")?.setFilterValue(event.target.value);
              }}
              className=" md:max-w-xs"
            />
          </div>
          <div className="col-span-12 text-center md:col-span-6 justify-center items-center flex gap-2">
            <p className="mr-2 text-sm ">Filtra por:</p>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto w-30 text-gray-dark font-light">
                    <Activity className="mr-auto" />
                    {accountStatus.find(
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
                  {accountStatus.map((status) => {
                    return (
                      <DropdownMenuItem
                        key={status.value}
                        className="capitalize"
                        defaultValue={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
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
                  <Button variant="outline" className="ml-auto w-40 text-gray-dark font-light">
                    {
                      TypeIcons[
                        (table.getColumn("type")?.getFilterValue() as AccountType) ?? "none"
                      ]
                    }
                    {accountTypes.find(
                      (type) => type.value == (table.getColumn("type")?.getFilterValue() as string)
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
                  {accountTypes.map((type) => {
                    return (
                      <DropdownMenuItem
                        key={type.value}
                        className="capitalize"
                        defaultValue={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
                        onClick={() => {
                          table.getColumn("type")?.setFilterValue(type.value);
                        }}
                      >
                        {TypeIcons[type.value as AccountType]}
                        {type.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 md:text-end">
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
          A mostrar {table.getRowCount()} de {pageCount} contas.
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
