"use client";

import Link from "next/link";
import { Building2, Wallet, CreditCard, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getUserColor } from "@/shared/utils";
import { Account, AccountType } from "@/features/accounts/types";
import { useTranslations } from "next-intl";

const accountTypeConfig: Record<AccountType, { icon: typeof Building2; className: string }> = {
  bank_account: {
    icon: Building2,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  cash: {
    icon: Wallet,
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  credit_card: {
    icon: CreditCard,
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  digital_wallet: {
    icon: Smartphone,
    className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
};

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const t = useTranslations("ACCOUNTS");
  const config = accountTypeConfig[account.type];
  const Icon = config.icon;
  const isNegative = account.balance < 0;

  return (
    <Link href={`/accounts/${account.id}`}>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30",
          !account.status && "opacity-60"
        )}
      >
        <CardContent className="px-5 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl",
                  config.className
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {account.name}
                  </h4>
                  {!account.status && (
                    <Badge
                      variant="destructive"
                      color="error"
                      className="text-xs bg-muted text-muted-foreground"
                    >
                      {t("INACTIVE")}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{account.typeTranslated}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p
                  className={cn(
                    "text-xl font-bold",
                    isNegative ? "text-destructive" : "text-foreground"
                  )}
                >
                  {account.balanceFormated}
                </p>
                {isNegative && <p className="text-xs text-muted-foreground">{t("OWED")}</p>}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground ">
            <span className="lowercase">
              {account.totalTransactions}{" "}
              {account.totalTransactions > 1 ? t("TRANSACTIONS") : t("TRANSACTION")}
            </span>
            <span>{account.currencyCode}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-border">
            {account.users && account.users.length > 0 && (
              <div className="flex items-center -space-x-2">
                {account.users.slice(0, 3).map((user) => (
                  <Avatar key={user.id} className="w-7 h-7 border-2 border-card">
                    <AvatarFallback
                      className={cn(
                        "text-[10px] text-secondary-foreground",
                        getUserColor(user?.name)
                      )}
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
                  <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      +{account.users.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
