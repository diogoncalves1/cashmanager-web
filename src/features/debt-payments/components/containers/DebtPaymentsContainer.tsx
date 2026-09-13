"use client";

import { useState } from "react";
import { NewDebtPaymentsButton, TableContainer } from "@/features/debt-payments";
import { useTranslations } from "next-intl";

export const PaymentsContainer = () => {
  const t = useTranslations("DEBT_PAYMENTS");
  const [load, setLoad] = useState(false);

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {t("PAYMENTS")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("PAYMENTS_PAGE_TEXT")}
          </p>
        </div>

        <NewDebtPaymentsButton className="sm:ml-auto" setLoad={setLoad} />
      </div>

      <TableContainer load={load} />
    </div>
  );
};
