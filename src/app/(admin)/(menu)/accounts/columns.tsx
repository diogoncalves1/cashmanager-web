import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { onDeleteAccount } from "@/services/accounts/service";
import { ColumnDef, useReactTable } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Banknote,
  Building2Icon,
  MoreHorizontal,
  CreditCard,
  Wallet,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Account } from "./data-table";
import Badge from "@/components/ui/badge/Badge";
import {} from "lucide-react";

const TypeIcons = {
  bank_account: <Building2Icon className="w-12" />,
  cash: <Banknote className="w-12" />,
  digital_wallet: <Wallet className="w-12" />,
  credit_card: <CreditCard className="w-12" />,
};

export function table(
  data: any,
  columns: any,
  setSorting: any,
  setColumnFilters: any,
  getCoreRowModel: any,
  getPaginationRowModel: any,
  getSortedRowModel: any,
  setColumnVisibility: any,
  setRowSelection: any,
  pageCount: any,
  state: any
) {
  return useReactTable({
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
    state: state,
  });
}

export const columns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: () => null,
    cell: () => null,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge type="rounded" color={row.getValue("status") ? "success" : "error"}>
        {row.original.statusTranslated}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const account = row.original;
      return (
        account.actions?.view && (
          <>
            <Button className="text-success-100">
              <Trash2 />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {account.actions?.view && (
                  <DropdownMenuItem asChild>
                    <Link href={`accounts/${account.id}`}>Ver Detalhes</Link>
                  </DropdownMenuItem>
                )}
                {account.actions?.edit && (
                  <DropdownMenuItem asChild>
                    <Link href={`accounts/${account.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                )}
                {account.actions?.destroy && (
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        onDeleteAccount(account.id);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Destroy
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      );
    },
  },
];
