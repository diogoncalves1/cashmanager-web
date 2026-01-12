import { Account } from "@/lib/models/account";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/accouts/StatusBadge";
import Link from "next/link";
import { AccountTypeIcon } from "@/components/accouts/AccountTypeIcons";
import { useTranslations } from "next-intl";

export function AccountHeader({ account }: { account: Account }) {
  const t = useTranslations("ACCOUNTS");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <AccountTypeIcon type={account.type} />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">{account.name}</h1>
            </div>

            <StatusBadge active={account.active} />
            <p className="text-sm text-gray-500">
              {account.typeTranslated} · {account.currencyCode}
            </p>
          </div>

          <div className="flex gap-3">
            {account.actions?.addTransaction && (
              <Link
                href={`/transactions/create`}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
              >
                {t("ADD_TRANSACTION")}
              </Link>
            )}
            {account.actions?.edit && (
              <Link
                href={`/accounts/${account.id}/edit`}
                className="rounded-xl border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {t("EDIT")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
