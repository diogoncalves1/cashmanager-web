import type { Metadata } from "next";
import React from "react";
import { getTranslations } from "next-intl/server";
import { FinancialGoalForm } from "@/features/financial-goals";
import { ArrowLeft, CalendarCheck2, PencilLine, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOALS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}
type Props = {
  params: Promise<{ id: string }>;
};

export default async function FinancialGoalEditPage({ params }: Props) {
  const t = await getTranslations("FINANCIAL_GOALS");
  const { id } = await params;

  return (
    <div className="grid gap-5">
      <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <PencilLine className="size-6" strokeWidth={1.75} />
            </div>
            <div>
              <Button asChild variant="app_gray" size="sm" className="mb-3">
                <Link href={`/financial-goals/${id}`}>
                  <ArrowLeft className="size-4" />
                  {t("BACK_TO_GOAL")}
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {t("EDIT_FINANCIAL_GOAL")}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                {t("EDIT_FINANCIAL_GOAL_TEXT")}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
            <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-900">
              <Target className="mb-2 size-5 text-accent" strokeWidth={1.75} />
              <p className="text-sm font-medium text-foreground">{t("REFINE_TARGET")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("REFINE_TARGET_TEXT")}</p>
            </div>
            <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-900">
              <CalendarCheck2 className="mb-2 size-5 text-accent" strokeWidth={1.75} />
              <p className="text-sm font-medium text-foreground">{t("KEEP_TIMELINE")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("KEEP_TIMELINE_TEXT")}</p>
            </div>
          </div>
        </div>
      </div>

      <FinancialGoalForm id={id} />
    </div>
  );
}
