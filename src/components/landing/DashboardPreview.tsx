import { useTranslations } from "next-intl";

export function DashboardPreviewSection() {
  const t = useTranslations("LANDING");
  return (
    <section id="dashboard" className="border-y border-border/40 bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {t("DASHBOARD")}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("DASHBOARD_SECTION_TITLE")}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            {t("DASHBOARD_SECTION_TEXT")}
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Accounts Overview */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("ACCOUNTS")}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">6</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("ACTIVE_ACCOUNTS")}</p>
            <div className="mt-4 space-y-2">
              {[t("MAIN_CHECKING"), t("SAVINGS"), t("CREDIT_CARD")].map((name) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-medium text-foreground">{t("ACTIVE")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("TRANSACTIONS")}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">1,247</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("THIS_MONTH")}</p>
            <div className="mt-4 flex items-end gap-0.5">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-accent/20"
                  style={{ height: `${h * 0.5}px` }}
                />
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("GOALS")}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">4</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("IN_PROGRESS")}</p>
            <div className="mt-4 space-y-3">
              {[
                { name: t("EMERGENCY_FUND"), pct: 75 },
                { name: t("VACATION"), pct: 42 },
                { name: t("NEW_CAR"), pct: 18 },
              ].map((goal) => (
                <div key={goal.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{goal.name}</span>
                    <span className="font-medium text-foreground">{goal.pct}%</span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${goal.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debts */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("DEBTS")}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">4</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("IN_PROGRESS")}</p>
            <div className="mt-4 space-y-3">
              {[
                { name: t("HOUSE"), pct: 99 },
                { name: t("CAR_LOAN"), pct: 36 },
                { name: t("PHONE"), pct: 12 },
              ].map((debt) => (
                <div key={debt.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{debt.name}</span>
                    <span className="font-medium text-foreground">{debt.pct}%</span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${debt.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
