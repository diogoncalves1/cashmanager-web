"use client";

import { useState } from "react";
import { NewDebtPaymentsButton, TableContainer } from "@/features/debt-payments";
import { useTranslations } from "next-intl";

export const PaymentsContainer = () => {
  const t = useTranslations("DEBT_PAYMENTS");
  const [load, setLoad] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("PAYMENTS")}</h1>
          <p className="text-sm text-muted-foreground">{t("PAYMENTS_PAGE_TEXT")}</p>
        </div>
        <NewDebtPaymentsButton setLoad={setLoad} />
      </div>

      <TableContainer load={load} />
    </div>
  );
};
