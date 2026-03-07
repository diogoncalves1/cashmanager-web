import { UserPlus, ArrowRightLeft, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create your accounts and goals",
    description:
      "Set up your financial accounts, define your savings goals, and organize your debts. Everything starts with a clear picture of where you stand.",
  },
  {
    step: "02",
    icon: ArrowRightLeft,
    title: "Track transactions and debts",
    description:
      "Log transactions, monitor debt payments, and watch your balances update in real time. Full visibility into every dollar.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Collaborate and grow with friends",
    description:
      "Invite friends and family to share accounts or goals. Work together on shared debts and celebrate financial milestones.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-y border-border/40 bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get started in three simple steps
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
