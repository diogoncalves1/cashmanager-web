"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getUserColor } from "@/shared/utils";
import { Account, accountTypeConfig } from "@/features/accounts";
import { useTranslations } from "next-intl";

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const t = useTranslations("ACCOUNTS");
  const config = accountTypeConfig[account.type];
  const Icon = config.icon;
  const isNegative = account.balance < 0;

  return (
    <Link href={`/accounts/${account.id}`} className="block">
      <div
        className={cn(
          "group relative overflow-hidden rounded-md border border-gray-100 bg-white px-5 py-4",
          "shadow-sm transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg",
          "dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700",
          !account.status && "opacity-60 saturate-[0.4]"
        )}
      >
        {/* Accent edge, only visible on hover — subtle signature detail */}
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-[3px] scale-y-0 rounded-full transition-transform duration-200 ease-out group-hover:scale-y-100",
            isNegative ? "bg-red-500" : "bg-success-500"
          )}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
                config.iconClassName,
                config.ringClassName
              )}
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-success-600 dark:text-gray-100 dark:group-hover:text-success-400">
                  {account.name}
                </h4>
                {!account.status && (
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {t("INACTIVE")}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{account.typeTranslated}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p
              className={cn(
                "text-xl font-bold tabular-nums tracking-tight",
                isNegative ? "text-red-500 dark:text-red-400" : "text-gray-900 dark:text-gray-100"
              )}
            >
              {account.balanceFormated}
            </p>
            {isNegative && (
              <p className="text-xs font-medium text-red-400 dark:text-red-500/80">{t("OWED")}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-600">
          <span className="lowercase">
            {account.totalTransactions}{" "}
            {account.totalTransactions > 1 ? t("TRANSACTIONS") : t("TRANSACTION")}
          </span>
          <span className="rounded-full bg-gray-50 px-2 py-0.5 font-medium tracking-wide text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
            {account.currencyCode}
          </span>
        </div>

        {account.users && account.users.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
            <div className="flex items-center -space-x-2">
              {account.users.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  className="h-7 w-7 border-2 border-white shadow-sm dark:border-gray-900"
                >
                  <AvatarFallback
                    className={cn("text-[10px] text-white", getUserColor(user?.name))}
                  >
                    {user && user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "..."}
                  </AvatarFallback>
                </Avatar>
              ))}
              {account.users.length > 3 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 dark:border-gray-900 dark:bg-gray-800">
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    +{account.users.length - 3}
                  </span>
                </div>
              )}
            </div>

            <ArrowUpRight
              className="size-4 -translate-x-1 translate-y-1 text-gray-300 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-success-500 group-hover:opacity-100 dark:text-gray-700"
              strokeWidth={2}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
