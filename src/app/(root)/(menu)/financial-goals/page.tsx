import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import FinancialGoalsContainer from "@/features/financial-goals/components/containers/FinancialGoalsContainer";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOALS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function FinancialGoalsPage() {
  const t = useTranslations("FINANCIAL_GOALS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOALS")}
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
        <FinancialGoalsContainer />
      </div>
    </>
  );
}
