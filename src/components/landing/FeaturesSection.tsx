import { Landmark, TrendingDown, Target, Users, PieChart, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesSection() {
  const t = useTranslations("LANDING");

  const features = [
    {
      icon: Landmark,
      title: t("ACCOUNTS_TRANSACTIONS"),
      description: t("ACCOUNTS_TRANSACTIONS_TEXT"),
    },
    {
      icon: TrendingDown,
      title: t("DEBT_MANAGEMENT"),
      description: t("DEBT_MANAGEMENT_TEXT"),
    },
    {
      icon: Target,
      title: t("FINANCIAL_GOALS"),
      description: t("FINANCIAL_GOALS_TEXT"),
    },
    {
      icon: Globe,
      title: t("MULTI_CURRENCY"),
      description: t("MULTI_CURRENCY_TEXT"),
    },
    {
      icon: Users,
      title: t("SOCIAL_FINANCE"),
      description: t("SOCIAL_FINANCE_TEXT"),
    },
    {
      icon: PieChart,
      title: t("INSIGHTS_ANALYTICS"),
      description: t("INSIGHTS_ANALYTICS_TEXT"),
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {t("FEATURES")}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("FEATURES_SECTION_TITLE")}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            {t("FEATURES_SECTION_TEXT")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-accent/30 hover:bg-card hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
