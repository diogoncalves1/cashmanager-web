import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DebtsContainer from "./components/DebtsContainer";
import { AppLink } from "@/components/ui/button/AppLink";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function DebtsPage() {
  const t = useTranslations("DEBTS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("DEBTS")} breadcrumb={[{ title: t("DEBTS") }]} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">{t("DEBTS")}</h1>
            <p className="text-muted-foreground mt-1">{t("DEBTS_TEXT")}</p>
          </div>
          <AppLink path="/debts/create" className=" px-5">
            <Plus className="w-4 h-4 mr-2" />
            {t("ADD_DEBT")}
          </AppLink>
        </div>

        <DebtsContainer />
      </div>
    </>
  );
}
