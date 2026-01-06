import { Plus } from "lucide-react";
import { AppLink } from "@/components/ui/button/AppLink";
import { TransactionsDataTable } from "@/app/(admin)/(menu)/transactions/data-table";
import { Account } from "@/lib/models/account";
import { memo } from "react";
import { useTranslations } from "next-intl";

type AccountTransactionsProps = {
  account?: Account;
};

function AccountTransactions({ account }: AccountTransactionsProps) {
  if (!account) return <></>;
  const t = useTranslations("ACCOUNTS");

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4 flex justify-between">
        <h2 className="text-lg font-semibold">{t("ALL_TRANSACTIONS")}</h2>
        {account.actions?.addTransaction && (
          <AppLink
            variant="default"
            path="/transactions/create"
            className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm gap-2 rounded-xl px-4 py-2"
          >
            <Plus className="size-5" />
            {t("ADD")}
          </AppLink>
        )}
      </div>

      <TransactionsDataTable accountId={account.id} enableFilters={false} />
    </div>
  );
}

export default memo(AccountTransactions);
