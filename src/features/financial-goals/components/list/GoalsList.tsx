"use client";

import GoalCard from "@/features/financial-goals/components/list/GoalCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useFinancialGoals } from "@/features/financial-goals/hooks/useFinancialGoals";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import GoalsListFail from "./GoalsListFail";
import { GoalCardLoading } from "@/features/financial-goals/components/ui/GoalCardLoading";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}

type Props = {
  goals: ReturnType<typeof useFinancialGoals>["goals"];
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  filters: Filters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  loading: boolean;
};

export default function GoalsList({
  goals,
  loadMore,
  hasMore,
  total,
  filters,
  setFilters,
  loading,
}: Props) {
  const t = useTranslations("FINANCIAL_GOALS");

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("SEARCH_FINANCIAL_GOALS")}
            value={filters?.search || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("STATUS")}:</span>
          <div className="flex items-center gap-1">
            {(
              [
                { label: t("ALL"), value: "all" },
                { label: t("IN_PROGRESS"), value: "in_progress" },
                { label: t("COMPLETED"), value: "completed" },
                { label: t("CANCELED"), value: "canceled" },
              ] as const
            ).map((status) => (
              <button
                key={status.value}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    status: status.value !== "all" ? status.value : "",
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
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("PRIORITY")}:</span>
          <Select
            value={filters?.priority || "all"}
            onValueChange={(v) =>
              setFilters((prev) => ({ ...prev, priority: v !== "all" ? v : "" }))
            }
          >
            <SelectTrigger className="w-32 h-9 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">{t("ALL")}</SelectItem>
              <SelectItem value="high">{t("HIGH")}</SelectItem>
              <SelectItem value="medium">{t("MEDIUM")}</SelectItem>
              <SelectItem value="low">{t("LOW")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("SORT")}:</span>
          <Select
            value={filters?.sort || "priority"}
            onValueChange={(v) => setFilters((prev) => ({ ...prev, sort: v }))}
          >
            <SelectTrigger className="w-36 h-9 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="priority">{t("PRIORITY")}</SelectItem>
              <SelectItem value="totalAmount">{t("TOTAL_AMOUNT")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Goals Grid */}
      {!loading && goals.length == 0 ? (
        <GoalsListFail />
      ) : !loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => (
            <GoalCard financialGoal={goal} key={goal.id} />
          ))}

          {hasMore && (
            <div className="flex justify-center col-span-3">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                className="gap-2 bg-transparent"
              >
                {t("LOAD_MORE")}
                <span className="text-muted-foreground">
                  ({total - goals.length}{" "}
                  {total - goals.length > 1 ? t("REMAINING_PLURAL") : t("REMAINING")})
                </span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-80">
            {Array.from({ length: 6 }).map((_, index) => (
              <GoalCardLoading key={index} />
            ))}
          </div>
        )
      )}
    </>
  );
}
