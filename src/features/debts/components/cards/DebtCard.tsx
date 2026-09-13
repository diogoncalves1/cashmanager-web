import { Debt, StatusBadge } from "@/features/debts";
import { SummaryCard } from "@/shared/ui/summary-card";
import { formatCurrency } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { Calendar, CreditCard, Percent, Wallet } from "lucide-react";

type Props = {
  debt: Debt;
};

export function DebtCard({ debt }: Props) {
  const t = useTranslations("DEBTS");
  const progress =
    debt.totalAmount > 0 ? Math.round((debt.paidAmount / debt.totalAmount) * 100) : 0;
  const safeProgress = Math.min(progress, 100);
  const remaining = debt.totalAmount - debt.paidAmount;
  const isPaid = debt.status === "paid";

  return (
    <SummaryCard
      href={`/debts/${debt.id}`}
      progress={safeProgress}
      progressColorClassName={isPaid ? "bg-emerald-500" : "bg-accent"}
      icon={<CreditCard className="size-4" strokeWidth={1.75} />}
      iconClassName={
        isPaid
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-accent/10 text-accent"
      }
      header={
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
              {debt.name}
            </h3>
            {debt.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {debt.description}
              </p>
            )}
          </div>
          <StatusBadge status={debt.status} translate={debt.statusTranslated} />
        </div>
      }
      progressTop={
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("PROGRESS")}</span>
          <span className="font-semibold text-foreground tabular-nums">{safeProgress}%</span>
        </div>
      }
      stats={[
        { label: t("TOTAL"), value: debt.totalAmountFormated },
        { label: t("PAID"), value: debt.paidAmountFormated, valueClassName: "text-accent" },
        {
          label: t("REMAINING"),
          value: formatCurrency(remaining, debt.totalAmountFormatedWithoutSymbol),
        },
      ]}
      footer={
        <div className="flex min-h-7 flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5">
            <Percent className="size-3.5" />
            <span className="tabular-nums">{debt.interestRate}%</span> {t("APR")}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span className="tabular-nums">
              {debt.monthsPaid}/{debt.months}
            </span>{" "}
            {debt.months > 1 ? t("MONTHS") : t("MONTH")}
          </span>
          <span className="flex items-center gap-1.5">
            <Wallet className="size-3.5" />
            <span className="tabular-nums">{debt.monthlyAmountFormated}</span>/{t("MONTH_ABR")}
          </span>
        </div>
      }
    />
  );
}
