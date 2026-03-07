import { Landmark, TrendingDown, Target, BarChart3, Users, PieChart } from "lucide-react";

const features = [
  {
    icon: Landmark,
    title: "Accounts & Transactions",
    description:
      "Track multiple accounts and all related transactions in one place. Get a clear picture of your cash flow across banks, savings, and credit cards.",
  },
  {
    icon: TrendingDown,
    title: "Debt Management",
    description:
      "Monitor debts and their payment history with detailed transaction tracking. Visualize your payoff progress and stay on schedule.",
  },
  {
    icon: Target,
    title: "Financial Goals",
    description:
      "Create savings goals and track contributions with full visibility. Set milestones and watch your progress grow over time.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Management",
    description:
      "Manage and monitor your investment portfolios. Track performance, allocation, and returns all in one dashboard.",
  },
  {
    icon: Users,
    title: "Social Finance",
    description:
      "Share accounts, debts, goals, and portfolios with trusted friends using a friendship-based permission system.",
  },
  {
    icon: PieChart,
    title: "Insights & Analytics",
    description:
      "Visual dashboards with income vs expense breakdowns, balance evolution, and performance insights to help you make smarter financial decisions.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Features</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to manage your finances
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            A comprehensive suite of tools designed to give you complete visibility and control over
            every aspect of your financial life.
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
