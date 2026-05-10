import { Debt } from "@/features/debts/types";
import Link from "next/link";
import { cn, formatCurrency } from "@/shared/utils";
import StatusBadge from "@/features/debts/components/cards/StatusBadge";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";

type Props = {
  debt: Debt;
};

export default function DebtCard({ debt }: Props) {
  const t = useTranslations("DEBTS");
  const progress = Math.round((debt.paidAmount / debt.totalAmount) * 100);
  const remaining = debt.totalAmount - debt.paidAmount;

  return (
    <Link
      key={debt.id}
      href={`/debts/${debt.id}`}
      className={cn(
        "group p-5 rounded-2xl bg-card border border-border block",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "hover:border-accent/30"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
            {debt.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">{debt.description}</p>
        </div>
        <StatusBadge status={debt.status} translate={debt.statusTranslated} />
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("PROGRESS")}</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              debt.status === "paid" ? "bg-emerald-500" : "bg-accent"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">{t("TOTAL")}</div>
          <div className="font-semibold text-foreground text-sm">{debt.totalAmountFormated}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">{t("PAID")}</div>
          <div className="font-semibold text-accent text-sm">{debt.paidAmountFormated}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">{t("REMAINING")}</div>
          <div className="font-semibold text-foreground text-sm">
            {formatCurrency(remaining, debt.totalAmountFormatedWithoutSymbol)}
          </div>
        </div>
      </div>

      {/* Footer */}
      {debt.months > 0 && debt.status !== "paid" && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            {debt.interestRate}% {t("APR")}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {debt.monthsPaid}/{debt.months} {debt.months > 1 ? t("MONTHS") : t("MONTH")}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {debt.monthlyAmountFormated}/{t("MONTH_ABR")}
          </span>
        </div>
      )}
    </Link>
  );
}
