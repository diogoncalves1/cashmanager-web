import { Button } from "@/components/ui/button";

type TFunction = (key: string, values?: Record<string, any>) => string;

type Props = {
  table: any;
  pageCount: number;
  total: number;
  pagination: any;
  t: TFunction;
};

export function DataTablePagination({ table, pageCount, total, pagination, t }: Props) {
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
    <div className="flex p-4 items-center justify-end space-x-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {t("SHOWING")} {table.getRowCount()} {t("OF")} {total} {t("THIS")}.
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
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
          {t("NEXT")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          {t("LAST")}
        </Button>
      </div>
    </div>
  );
}
