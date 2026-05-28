import { flexRender, Table as ReactTable, ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

export default function DataTable<TData>({
  table,
  isLoading,
  columns,
  nLines = 10,
  nCols = 7,
}: {
  table: ReactTable<TData>;
  isLoading: boolean;
  columns: ColumnDef<TData, unknown>[];
  nLines?: number;
  nCols?: number;
}) {
  const t = useTranslations("DATATABLE");

  return (
    <>
      {/* Desktop — tabela normal com scroll horizontal */}
      <div className="hidden sm:block overflow-x-auto">
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
          <TableBody className={isLoading ? "opacity-35" : ""}>
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
              Array.from({ length: nLines }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: nCols }).map((_, j) => (
                    <TableCell key={j} className="text-sm text-muted-foreground">
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
      </div>

      {/* Mobile — vista de cards */}
      <div className="sm:hidden max-w-100 divide-y divide-border">
        {isLoading ? (
          Array.from({ length: nLines }).map((_, i) => (
            <div key={i} className="p-4 space-y-2 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-5 w-16 bg-muted rounded" />
              </div>
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const cells = row.getVisibleCells();
            // amount é sempre a primeira coluna visível, date a segunda
            const amountCell = cells[0];
            const dateCell = cells[1];
            const descCell = cells[2];
            const statusCell = cells.find((c) => c.column.id === "status");
            const actionsCell = cells.find((c) => c.column.id === "actions");

            return (
              <div key={row.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Ícone + valor (AmountCell já tem o layout certo) */}
                  {amountCell && (
                    <div className="shrink-0 w-30">
                      {flexRender(amountCell.column.columnDef.cell, amountCell.getContext())}
                    </div>
                  )}
                  <div className="min-w-0">
                    {descCell && (
                      <p className="truncate text-sm font-medium text-foreground">
                        {flexRender(descCell.column.columnDef.cell, descCell.getContext())}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      {dateCell && (
                        <span className="text-xs text-muted-foreground">
                          {flexRender(dateCell.column.columnDef.cell, dateCell.getContext())}
                        </span>
                      )}
                      {statusCell && (
                        <span className="text-xs">
                          {flexRender(statusCell.column.columnDef.cell, statusCell.getContext())}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {actionsCell && (
                  <div className="shrink-0">
                    {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
            {t("NO_RESULTS")}.
          </div>
        )}
      </div>
    </>
  );
}
