import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
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
            <span className="text-xs font-medium text-accent">Now in Open Beta</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Take Full Control of Your Financial Life
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Track accounts, manage debts, set goals, and grow your portfolio. Collaborate with
            friends and family through secure, permission-based sharing.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8 text-base" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8 text-base" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {[
              { value: "10k+", label: "Active Users" },
              { value: "$2.5B", label: "Tracked" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9/5", label: "User Rating" },
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
            <span className="ml-3 text-xs text-muted-foreground">Cash Manager Dashboard</span>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Total Balance</p>
                <p className="mt-1 text-2xl font-bold text-foreground">$142,850.75</p>
                <p className="mt-1 text-xs text-success">+12.5% this month</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Active Debts</p>
                <p className="mt-1 text-2xl font-bold text-foreground">$18,240.00</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[65%] rounded-full bg-accent" />
                </div>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Goals Progress</p>
                <p className="mt-1 text-2xl font-bold text-foreground">73%</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[73%] rounded-full bg-chart-3" />
                </div>
              </div>
            </div>
            {/* Transaction rows */}
            <div className="mt-4 space-y-2">
              {[
                { desc: "Salary Deposit", date: "Feb 1", amount: "+$3,500.00", type: "income" },
                { desc: "Mortgage Payment", date: "Feb 3", amount: "-$1,250.00", type: "expense" },
                { desc: "Investment Return", date: "Feb 5", amount: "+$420.50", type: "income" },
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
