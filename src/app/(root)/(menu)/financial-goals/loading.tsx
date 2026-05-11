import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { GoalCardLoading } from "@/features/financial-goals";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOALS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function Loading() {
  const t = useTranslations("FINANCIAL_GOALS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOAL")}
        breadcrumb={[{ title: t("FINANCIAL_GOALS") }]}
      />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
              {t("FINANCIAL_GOALS")}
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">{t("FINANCIAL_GOALS_TEXT")}</p>
          </div>
          <Link
            className="h-9 px-6 shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90"
            href="/financial-goals/create"
          >
            <Plus />
            {t("NEW_GOAL")}
          </Link>
        </div>
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
      </div>
    </>
  );
}
