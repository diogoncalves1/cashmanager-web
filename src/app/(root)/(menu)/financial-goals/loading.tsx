import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import Link from "next/link";
import FinancialGoalsContainerSkeleton from "./components/FinancialGoalsContainerSkeleton";
import { GoalCardLoading } from "./components/GoalCardLoading";

export default function Loading() {
  const t = useTranslations("FINANCIAL_GOALS");

  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <div className="flex flex-wrap items-center gap-3 mb-6 animate-pulse">
        <div className="relative flex-1 max-w-sm">
          <div className="h-9 bg-muted rounded w-full pl-9" />
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-16 bg-muted rounded" />
          <div className="flex items-center gap-1">
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="h-4 w-16 bg-muted rounded" />
          <div className="h-9 w-32 bg-muted rounded" />
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="h-4 w-16 bg-muted rounded" />
          <div className="h-9 w-36 bg-muted rounded" />
        </div>
      </div>

      {/* Goals Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <GoalCardLoading key={index} />
        ))}
      </div>
    </div>
  );
}
