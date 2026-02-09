import React from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import DebtForm from "@/components/form/debts/DebtForm";

type Props = {
  params: { id: string };
};

export default function NewDebtPage({ params }: Props) {
  const { id } = params;
  const t = useTranslations("DEBTS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBT")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("EDIT") }]}
      />
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="mb-4 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/debts">
              <ArrowLeft className="size-4" />
              Back to Debts
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create New Debt</h1>
              <p className="text-muted-foreground">
                Add a new debt to track your financial obligations
              </p>
            </div>
          </div>
          <DebtForm id={id} />
        </div>
      </div>
    </>
  );
}
