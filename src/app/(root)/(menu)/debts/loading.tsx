import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AppLink } from "@/components/ui/button/AppLink";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const Loading = () => {
  const t = useTranslations("DEBTS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("DEBT")} breadcrumb={[{ title: t("DEBTS") }]} />
      <div className="max-w-7xl mx-auto px-6 py-10">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-card border border-border shadow-sm animate-pulse h-28"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 flex justify-center border border-border rounded-lg bg-card animate-pulse h-50"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Loading;
