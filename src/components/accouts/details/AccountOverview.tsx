import { Account } from "@/lib/models/account";
import { Transaction } from "@/lib/models/transaction";

import { memo } from "react";
import { StatusBadge } from "@/components/accouts/StatusBadge";
import { useTranslations } from "next-intl";

type AccountOverviewProps = {
  account?: Account;
  recentTransaction: Transaction[];
};

function AccountOverview({ account, recentTransaction }: AccountOverviewProps) {
  const t = useTranslations("ACCOUNTS");
  if (!account) return <></>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: t("TRANSACTIONS"), value: account.totalTransactions },
            { label: t("USERS"), value: account.users?.length },
            {
              label: "Criada em",
              value: new Date(account.createdAt ?? "2025-01-20").toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }),
            },
          ].map((m) => (
            <div
              key={m.label}
              className="
                        rounded-2xl border bg-white p-6 shadow-sm
                        transition-all duration-200
                        hover:-translate-y-1 hover:shadow-lg
                      "
            >
              <p className="text-sm text-gray-500">{m.label}</p>
              <p className="mt-2 text-2xl font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
        {recentTransaction.length > 0 && (
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Transações Recentes</h2>
            </div>

            <div className="divide-y">
              {recentTransaction.map((t) => (
                <div key={t.id} className="flex justify-between px-6 py-4 hover:bg-gray-50">
                  <span>{t.category?.name}</span>
                  <span>{t.date}</span>
                  <span>{t.userName}</span>
                  <span
                    className={`font-medium ${
                      t.type == "expense" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {t.amountFormated}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold">Detalhes da Conta</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Nome</span>
            <span>{account.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tipo</span>
            <span>{account.typeTranslated}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Moeda</span>
            <span>{account.currencyCode}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Estado</span>
            <StatusBadge active={account.active} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AccountOverview);
