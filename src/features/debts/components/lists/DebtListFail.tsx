"use client";

import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

export const DebtListFail = () => {
  const t = useTranslations("DEBTS");

  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center dark:border-gray-800 dark:bg-gray-900/40">
      <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm dark:bg-gray-800 dark:text-gray-500">
        <CreditCard className="size-7" strokeWidth={1.75} />
      </div>
      <h3 className="mb-1 font-medium text-gray-900 dark:text-gray-100">{t("NO_DEBTS_FOUND")}</h3>
      <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">{t("NO_DEBTS_TEXT")}</p>
    </div>
  );
};
