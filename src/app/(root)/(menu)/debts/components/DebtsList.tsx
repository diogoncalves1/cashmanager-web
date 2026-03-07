"use client";

import { cn } from "@/lib/utils";
import { useDebts } from "../hooks/useDebts";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DebtCard from "./DebtCard";
import DebtListFail from "./DebtListFail";
import DebtCardLoading from "./DebtCardLoading";

interface Filters {
  search?: string;
  status?: string;
  sort?: string;
}

type Props = {
  debts: ReturnType<typeof useDebts>["debts"];
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  filters: Filters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<Filters | undefined>>;
  isLoadingMore: boolean;
  loading: boolean;
};

export default function DebtsList({
  debts,
  loadMore,
  hasMore,
  total,
  filters,
  loading,
  setFilters,
  isLoadingMore,
}: Props) {
  const t = useTranslations("DEBTS");

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("SEARCH_DEBTS")}
            value={filters?.search || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(
            [
              { label: t("ALL"), value: "all" },
              { label: t("PAID"), value: "paid" },
              { label: t("PENDING"), value: "pending" },
            ] as const
          ).map((status) => (
            <button
              key={status.value}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: status.value !== "all" ? status.value : undefined,
                }))
              }
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                filters?.status
                  ? filters?.status === status.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : status.value === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {status.label.charAt(0).toUpperCase() + status.label.slice(1)}
            </button>
          ))}
        </div>
        {/* <div className="sm:ml-auto">
          <Select
            value={filters?.sort || "remaining"}
            onValueChange={(v) => setFilters((prev) => ({ ...prev, sort: v }))}
          >
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="remaining">{t("REMAINING_AMOUNT")}</SelectItem>
              <SelectItem value="totalAmount">Total Amount</SelectItem>
              <SelectItem value="interestRate">Interest Rate</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {!loading && debts.length == 0 ? (
        <DebtListFail />
      ) : !loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {debts.map((debt) => (
            <DebtCard debt={debt} key={debt.id} />
          ))}

          {hasMore && (
            <div className="flex justify-center col-span-2">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="gap-2 bg-transparent"
              >
                {t("LOAD_MORE")}
                <span className="text-muted-foreground">({total - debts.length} remaining)</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-80">
            {Array.from({ length: 4 }).map((_, index) => (
              <DebtCardLoading key={index} />
            ))}
          </div>
        )
      )}
    </>
  );
}
