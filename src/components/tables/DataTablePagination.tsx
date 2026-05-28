import { Button } from "@/components/ui/button";
import { Table as ReactTable } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

type TFunction = ReturnType<typeof useTranslations>;

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export function DataTablePagination<TData>({
  table,
  pageCount,
  total,
  pagination,
  t,
}: {
  table: ReactTable<TData>;
  pageCount: number;
  total: number;
  pagination: PaginationState;
  t: TFunction;
}) {
  const getPageNumbers = () => {
    const totalPages = Math.ceil(total / pagination.pageSize);

    const current = pagination.pageIndex + 1;
    const delta = 2;

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

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-muted-foreground text-sm text-center sm:text-left">
        {t("SHOWING")} {table.getRowCount()} {t("OF")} {total} {t("THIS")}.
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {/* First — só em desktop */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="hidden sm:inline-flex"
        >
          {t("FIRST")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t("PREVIOUS")}
        </Button>

        {/* Números de página — só em desktop */}
        <div className="hidden sm:flex items-center gap-1 mx-1">
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

        {/* Indicador de página atual — só em mobile */}
        <span className="sm:hidden text-sm text-muted-foreground px-2">
          {pagination.pageIndex + 1} / {pageCount}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t("NEXT")}
        </Button>

        {/* Last — só em desktop */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          className="hidden sm:inline-flex"
        >
          {t("LAST")}
        </Button>
      </div>
    </div>
  );
}
