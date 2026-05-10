import React from "react";
import { CreditCard } from "lucide-react";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { useTranslations } from "next-intl";
import { DebtForm } from "@/features/debts";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function NewDebtPage() {
  const t = useTranslations("DEBTS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBTS")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("ADD") }]}
      />
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t("CREATE_NEW_DEBT")}</h1>
              <p className="text-muted-foreground">{t("CREATE_NEW_DEBT_TEXT")}</p>
            </div>
          </div>
          <DebtForm />
        </div>
      </div>
    </>
  );
}
