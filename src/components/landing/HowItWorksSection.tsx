import { UserPlus, ArrowRightLeft, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function HowItWorksSection() {
  const t = useTranslations("LANDING");

  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: t("HOW_IT_WORKS_STEP_ONE_TITLE"),
      description: t("HOW_IT_WORKS_STEP_ONE_TEXT"),
    },
    {
      step: "02",
      icon: ArrowRightLeft,
      title: t("HOW_IT_WORKS_STEP_TWO_TITLE"),
      description: t("HOW_IT_WORKS_STEP_TWO_TEXT"),
    },
    {
      step: "03",
      icon: TrendingUp,
      title: t("HOW_IT_WORKS_STEP_THREE_TITLE"),
      description: t("HOW_IT_WORKS_STEP_THREE_TEXT"),
    },
  ];
  return (
    <section id="how-it-works" className="border-y border-border/40 bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {t("HOW_IT_WORKS")}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("HOW_IT_WORKS_TITLE")}
          </h2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item, i) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-accent/30 to-transparent lg:block" />
              )}
              <div className="relative flex size-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
                <item.icon className="size-7 text-accent" />
                <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
