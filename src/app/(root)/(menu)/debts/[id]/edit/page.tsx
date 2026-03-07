import React from "react";
import { CreditCard } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DebtForm from "@/components/form/debts/DebtForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditDebtPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("DEBTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBTS")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("EDIT") }]}
      />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t("EDIT_DEBT")}</h1>
              <p className="text-muted-foreground">{t("EDIT_DEBT_TEXT")}</p>
            </div>
          </div>
          <DebtForm id={id} />
        </div>
      </div>
    </>
  );
}
