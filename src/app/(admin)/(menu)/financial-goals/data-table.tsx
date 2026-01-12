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
  CheckCircle2Icon,
  ChevronDown,
  Circle,
  Dot,
  Edit3,
  Eye,
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
import { useTranslations } from "next-intl";
import {
  FinancialGoal,
  FinancialGoalPriority,
  FinancialGoalStatus,
  getFinancialGoalPriorities,
  getFinancialGoalStatus,
  prioritiesColors,
  statusColors,
} from "@/lib/models/financialGoal";
import { TypeIcons } from "@/components/financial-goals/TypeIcons";
import { UserCircle } from "@/components/ui/avatar/UserCircle";
import { onDeleteFinancialGoal, onMarkPaidFinancialGoal } from "@/services/financial-goals/service";
import { DataTablePagination } from "@/components/tables/DataTablePagination";

type DataTableProps = {
  enableFilters?: boolean;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
  enablePriorityFilter?: boolean;
  accountId?: string;
  enableUser?: boolean;
  userId?: string;
};

export function DataTable({
  enableFilters = true,
  enableSearch = true,
  enableStatusFilter = true,
  enablePriorityFilter = true,
}: DataTableProps) {
  const t = useTranslations("FINANCIAL_GOALS");
  const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: "name" }]);
  const columnsString = () => {
    const columns = [
      { data: "name", name: "name", searchable: true },
      { data: "totalAmount", name: "totalAmount", searchable: true },
      { data: "userName", name: "userName", searchable: true },
      { data: "AmountContributed", name: "AmountContributed", searchable: true },
      { data: "dueDate", name: "dueDate", searchable: true },
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
  const extraOptString = extraParams.toString();

  const url = `/financial-goals?page=${pagination.pageIndex}&size=${
    pagination.pageSize
  }&sort=${sortingString}&${filterString}&${extraOptString}&${columnsString()}`;

  const { data: apiData, mutate, isLoading } = useSWR([url, { method: "GET" }], fetcher);

  React.useEffect(() => {
    if (apiData) {
      setPageCount(Math.ceil(apiData.recordsTotal / pagination.pageSize));
    }
  }, [apiData]);

  const columns: ColumnDef<FinancialGoal>[] = [
    {
      accessorKey: "search",
      header: () => null,
      cell: () => null,
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("NAME")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-light text-md capitalize">{row.getValue("name")}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("TOTAL_AMOUNT")}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-light text-left px-4 py-2 has-[>svg]:px-3">
            {row.original.totalAmountFormated}
          </div>
        );
      },
    },
    {
      accessorKey: "contributedAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("CONTRIBUTED_AMOUNT")}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-light text-left px-4 py-2 has-[>svg]:px-3">
            {row.original.contributedAmountFormated}
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("DUE_DATE")}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-light text-left px-4 py-2 has-[>svg]:px-3">{row.original.dueDate}</div>
      ),
    },
    {
      accessorKey: "status",
      header: t("STATUS"),
      cell: ({ row }) => (
        <Badge
          type="rounded"
          size="sm"
          color={statusColors[row.getValue("status") as FinancialGoalStatus]}
        >
          <Dot className="size-4" strokeWidth={6} />
          {row.original.statusTranslated}
        </Badge>
      ),
    },
    {
      accessorKey: "priority",
      header: () => t("PRIORITY"),
      cell: ({ row }) => (
        <Badge
          type="rounded"
          size="sm"
          color={prioritiesColors[row.getValue("priority") as FinancialGoalPriority]}
        >
          <Dot className="size-4" strokeWidth={6} />
          {row.original.priorityTranslated}
        </Badge>
      ),
    },
    {
      accessorKey: "users",
      header: t("USERS"),
      cell: ({ row }) => {
        const financialGoal = row.original;
        return (
          <div className="flex -space-x-2">
            {financialGoal.users?.map((user, index) => (
              <UserCircle key={index} userName={user.name} />
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: t("ACTIONS"),
      cell: ({ row }) => {
        const financialGoal = row.original;
        return (
          <>
            {financialGoal.actions?.markCompleted && (
              <Button
                className="bg-success-100 text-success-500 hover:bg-success-500 hover:text-white ms-1"
                size={"icon-sm"}
                variant={"ghost"}
                onClick={async () => {
                  try {
                    onMarkPaidFinancialGoal(financialGoal.id, mutate);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <CheckCircle2Icon />
              </Button>
            )}
            {financialGoal.actions?.view && (
              <AppLink
                path={`financial-goals/${financialGoal.id}`}
                className="bg-blue-100  text-blue-500 hover:bg-blue-500 hover:text-white ms-1"
                size={"icon-sm"}
                variant={"ghost"}
              >
                <Eye />
              </AppLink>
            )}
            {financialGoal.actions?.edit && (
              <AppLink
                path={`financial-goals/${financialGoal.id}/edit`}
                className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white ms-1"
                size={"icon-sm"}
                variant={"ghost"}
              >
                <Edit3 />
              </AppLink>
            )}
            {financialGoal.actions?.destroy && (
              <Button
                className="bg-error-100 text-error-500 hover:bg-error-500 hover:text-white ms-1"
                size={"icon-sm"}
                variant={"ghost"}
                onClick={async () => {
                  try {
                    onDeleteFinancialGoal(financialGoal.id, table, pagination, mutate);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Trash2 />
              </Button>
            )}
          </>
        );
      },
    },
  ];

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

  React.useEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      columns,
    }));
  }, [table, columns]);

  const financialGoalStatus = getFinancialGoalStatus(t);
  const FinancialGoalPriorities = getFinancialGoalPriorities(t);

  return (
    <div className="w-full bg-white rounded-sm shadow-md  border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      {enableFilters && (
        <div className="border-b p-4">
          <div className="grid grid-cols-12 gap-4">
            {enableSearch && (
              <div className="col-span-12 md:col-span-4">
                <Input
                  placeholder={`${t("SEARCH")} ...`}
                  value={(table.getColumn("search")?.getFilterValue() as string) ?? ""}
                  onChange={(e) => {
                    table.getColumn("search")?.setFilterValue({ value: e.target.value });
                  }}
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
                      {financialGoalStatus.find(
                        (status) => status.value == table.getColumn("status")?.getFilterValue()
                      )?.label ?? t("STATUS")}
                      <ChevronDown className="ml-2 h-4 w-4" />
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
                      {t("STATUS")}
                    </DropdownMenuItem>
                    {financialGoalStatus.map((status) => {
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
              )}

              {enablePriorityFilter && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {
                        TypeIcons[
                          (table
                            .getColumn("priority")
                            ?.getFilterValue() as FinancialGoalPriority) ?? "none"
                        ]
                      }
                      {FinancialGoalPriorities.find(
                        (priority) =>
                          priority.value ==
                          (table.getColumn("priority")?.getFilterValue() as string)
                      )?.label ?? (
                        <>
                          <Circle /> {t("PRIORITY")}
                        </>
                      )}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      key="all"
                      className="capitalize"
                      defaultValue={(table.getColumn("priority")?.getFilterValue() as string) ?? ""}
                      onClick={() => {
                        table.getColumn("priority")?.setFilterValue(null);
                      }}
                    >
                      <Circle /> {t("PRIORITY")}
                    </DropdownMenuItem>
                    {FinancialGoalPriorities.map((priority) => {
                      return (
                        <DropdownMenuItem
                          key={priority.value}
                          className="capitalize"
                          defaultValue={
                            (table.getColumn("priority")?.getFilterValue() as string) ?? ""
                          }
                          onClick={() => {
                            table.getColumn("priority")?.setFilterValue(priority.value);
                          }}
                        >
                          {TypeIcons[priority.value as FinancialGoalPriority]}
                          {priority.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="col-span-12 md:col-span-3 md:text-end">
              <AppLink
                variant="default"
                path="/financial-goals/create"
                className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm gap-2"
              >
                <Plus className="size-5" />
                {t("ADD")}
              </AppLink>
            </div>
          </div>
        </div>
      )}
      <Table className="border-b">
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
