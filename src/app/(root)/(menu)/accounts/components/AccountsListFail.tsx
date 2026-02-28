import { useTranslations } from "next-intl";
import React from "react";

const AccountsListFail = () => {
  const t = useTranslations("ACCOUNTS");
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <p className="text-muted-foreground">{t("NO_ACCOUNTS_FOUND")}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t("NO_ACCOUNTS_FOUND_TEXT")}</p>
    </div>
  );
};

export default AccountsListFail;
