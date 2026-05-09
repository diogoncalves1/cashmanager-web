"use client";

import { useState } from "react";
import TableContainer from "./TableContainer";
import { NewTransactionButton } from "@/features/financial-goal-transactions/components/actions/NewTransactionButton";
import { useTranslations } from "next-intl";

const TransactionsContainer = () => {
  const t = useTranslations("TRANSACTIONS");
  const [load, setLoad] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("TRANSACTIONS")}</h1>
          <p className="text-sm text-muted-foreground">{t("TRANSACTIONS_PAGE_TEXT")}</p>
        </div>
        <NewTransactionButton setLoad={setLoad} />
      </div>

      {/* Summary cards */}
      <TableContainer load={load} />
    </div>
  );
};

export default TransactionsContainer;
