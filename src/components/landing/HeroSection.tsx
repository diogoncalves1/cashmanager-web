import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { formatDate } from "@/shared/utils";

export function HeroSection() {
  const t = useTranslations("LANDING");
  const monthsT = useTranslations("MONTHS");

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 size-[800px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
            <Sparkles className="size-3.5 text-accent" />
            <span className="text-xs font-medium text-accent">{t("NOW_IN_OPEN_BETA")}</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t("TAKE_FULL_CONTROL_FINANCIAL_LIFE")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t("HERO_SECTION_TEXT")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8 text-base" asChild>
              <Link href="/signup">
                {t("GET_STARTED_FREE")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8 text-base" asChild>
              <a href="#how-it-works">{t("SEE_HOW_IT_WORKS")}</a>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {[
              { value: "10k+", label: t("ACTIVE_USERS") },
              { value: "99.9%", label: t("UPTIME") },
              { value: "2", label: t("LANGUAGES") },
              { value: "90+", label: t("AVAILABLE_CURRENCIES") },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-20 overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-2xl shadow-accent/5">
          <div className="flex items-center gap-1.5 border-b border-border/50 px-4 py-3">
            <div className="size-2.5 rounded-full bg-destructive/60" />
            <div className="size-2.5 rounded-full bg-warning-500/60" />
            <div className="size-2.5 rounded-full bg-accent/60" />
            <span className="ml-3 text-xs text-muted-foreground">
              Cash Manager {t("DASHBOARD")}
            </span>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">{t("TOTAL_BALANCE")}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {t("TOTAL_BALANCE_AMOUNT")}
                </p>
                <p className="mt-1 text-xs text-success">+12.5% {t("THIS_MONTH")}</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">{t("ACTIVE_DEBTS")}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {t("ACTIVE_DEBTS_AMOUNT")}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[65%] rounded-full bg-accent" />
                </div>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">{t("GOALS_PROGRESS")}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">73%</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[73%] rounded-full bg-chart-3" />
                </div>
              </div>
            </div>
            {/* Transaction rows */}
            <div className="mt-4 space-y-2">
              {[
                {
                  desc: t("SALARY_DEPOSIT"),
                  date: formatDate("01-02", monthsT),
                  amount: t("SALARY_DEPOSIT_AMOUNT"),
                  type: "income",
                },
                {
                  desc: t("MORTGAGE_PAYMENT"),
                  date: formatDate("03-02", monthsT),
                  amount: t("MORTGAGE_PAYMENT_AMOUNT"),
                  type: "expense",
                },
                {
                  desc: t("INVESTMENT_RETURN"),
                  date: formatDate("05-02", monthsT),
                  amount: t("INVESTMENT_RETURN_AMOUNT"),
                  type: "income",
                },
              ].map((tx) => (
                <div
                  key={tx.desc}
                  className="flex items-center justify-between rounded-lg border border-border/30 bg-background/30 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.desc}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${tx.type === "income" ? "text-accent" : "text-destructive"}`}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
