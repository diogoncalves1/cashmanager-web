import { FinancialGoalTransaction } from "@/models/financialGoalTransactions";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

export default function DataTable({
  table,
  isLoading,
  columns,
}: {
  table: ReactTable<any>;
  isLoading: boolean;
  columns: any;
}) {
  const t = useTranslations("DATATABLE");

  return (
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
      <TableBody className={`${isLoading ? "opacity-35" : ""} `}>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="text-sm text-muted-foreground">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableCell key={i} className="text-sm text-muted-foreground">
                  <div className="flex items-baseline justify-between shadow-sm animate-pulse">
                    <div className="h-5 w-20 bg-muted rounded" />
                  </div>
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
  );
}
