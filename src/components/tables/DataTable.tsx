import { useEffect, useState } from "react";
import { flexRender, Table as ReactTable, ColumnDef, Row } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/utils";
import { Spinner } from "@/components/ui/spinner";

export type DataTableMeta<TData> = {
  onRowClick?: (row: TData) => void;
};

export default function DataTable<TData>({
  table,
  isLoading,
  columns,
}: {
  table: ReactTable<TData>;
  isLoading: boolean;
  columns: ColumnDef<TData, unknown>[];
}) {
  const t = useTranslations("DATATABLE");

  const meta = table.options.meta as DataTableMeta<TData> | undefined;
  const onRowClick = meta?.onRowClick;

  const visibleLeafColumns = table.getVisibleLeafColumns();
  const rows = table.getRowModel().rows;

  // Guarda a última lista de rows válida. Se o hook de fetching limpar os
  // dados enquanto um novo pedido está a decorrer, continuamos a mostrar
  // esta cache (esbatida, com spinner por cima) em vez de esvaziar a
  // tabela. Só troca para os dados novos quando eles realmente chegarem.
  const [cachedRows, setCachedRows] = useState<Row<TData>[]>(rows);

  useEffect(() => {
    if (!isLoading) {
      // Atualiza a cache sempre que terminamos um load — mesmo que o
      // resultado seja vazio (nesse caso mostramos "sem resultados").
      setCachedRows(rows);
    } else if (rows.length > 0) {
      // Já chegaram dados novos enquanto isLoading ainda não desligou
      // (ex: paginação otimista) — atualiza na mesma.
      setCachedRows(rows);
    }
  }, [rows, isLoading]);

  const displayRows = isLoading && rows.length === 0 ? cachedRows : rows;
  const hasRows = displayRows.length > 0;
  const isShowingStaleData = isLoading && rows.length === 0 && cachedRows.length > 0;
  const isRefetching = isLoading && hasRows;

  // Só mostramos um spinner "cru", sem tabela por trás, quando não há
  // absolutamente nenhum dado (nem novo, nem em cache) para mostrar —
  // ou seja, o primeiro load da página.
  const isInitialLoading = isLoading && !hasRows;

  return (
    <>
      {/* Desktop — tabela normal com scroll horizontal */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="relative">
          {isRefetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          )}

          <Table className="table-fixed w-full">
            <colgroup>
              {visibleLeafColumns.map((column) => (
                <col key={column.id} style={{ width: column.getSize() }} />
              ))}
            </colgroup>

            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header) =>
                      header.column.getIsVisible() && (
                        <TableHead key={header.id} className="truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                  )}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody
              className={cn(
                "transition-opacity duration-150",
                isRefetching && "opacity-40 pointer-events-none"
              )}
            >
              {isInitialLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 text-center">
                    <div className="flex items-center justify-center">
                      <Spinner className="size-6 text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : hasRows ? (
                displayRows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => !isShowingStaleData && onRowClick?.(row.original)}
                    className={cn(
                      onRowClick && !isShowingStaleData && "cursor-pointer hover:bg-muted/50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isActions = cell.column.id === "actions";
                      return (
                        <TableCell
                          key={cell.id}
                          className="text-sm text-muted-foreground overflow-hidden"
                          onClick={isActions ? (e) => e.stopPropagation() : undefined}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
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
      </div>

      {/* Mobile — vista de cards */}
      <div className="sm:hidden max-w-100">
        <div className="relative">
          {isRefetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          )}

          <div
            className={cn(
              "divide-y divide-border transition-opacity duration-150",
              isRefetching && "opacity-40 pointer-events-none"
            )}
          >
            {isInitialLoading ? (
              <div className="h-40 flex items-center justify-center">
                <Spinner className="size-6 text-muted-foreground" />
              </div>
            ) : hasRows ? (
              displayRows.map((row) => {
                const cells = row.getVisibleCells();
                const amountCell = cells.find((c) => c.column.id === "amount");
                const dateCell = cells.find((c) => c.column.id === "date");
                const statusCell = cells.find((c) => c.column.id === "status");
                const accountCell = cells.find((c) => c.column.id === "account");
                const actionsCell = cells.find((c) => c.column.id === "actions");

                return (
                  <div
                    key={row.id}
                    onClick={() => !isShowingStaleData && onRowClick?.(row.original)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-3",
                      onRowClick && !isShowingStaleData && "cursor-pointer active:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Ícone + valor (AmountCell já tem o layout certo) */}
                      {amountCell && (
                        <div className="shrink-0 w-30">
                          {flexRender(amountCell.column.columnDef.cell, amountCell.getContext())}
                        </div>
                      )}
                      <div className="min-w-0">
                        {accountCell && (
                          <div className="truncate text-sm font-medium text-foreground">
                            {flexRender(
                              accountCell.column.columnDef.cell,
                              accountCell.getContext()
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          {dateCell && (
                            <span className="text-xs text-muted-foreground">
                              {flexRender(dateCell.column.columnDef.cell, dateCell.getContext())}
                            </span>
                          )}
                          {statusCell && (
                            <span className="text-xs">
                              {flexRender(
                                statusCell.column.columnDef.cell,
                                statusCell.getContext()
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {actionsCell && (
                      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
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
        </div>
      </div>
    </>
  );
}
