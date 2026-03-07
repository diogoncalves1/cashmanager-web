export function DashboardPreviewSection() {
  return (
    <section id="dashboard" className="border-y border-border/40 bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Dashboard Preview
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything at a glance
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            A powerful dashboard that puts all your financial data front and center with intuitive
            visualizations.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Accounts Overview */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Accounts
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">6</p>
            <p className="mt-1 text-xs text-muted-foreground">Active accounts</p>
            <div className="mt-4 space-y-2">
              {["Main Checking", "Savings", "Credit Card"].map((name) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-medium text-foreground">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Transactions
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">1,247</p>
            <p className="mt-1 text-xs text-muted-foreground">This month</p>
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
              Goals
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">4</p>
            <p className="mt-1 text-xs text-muted-foreground">In progress</p>
            <div className="mt-4 space-y-3">
              {[
                { name: "Emergency Fund", pct: 75 },
                { name: "Vacation", pct: 42 },
                { name: "New Car", pct: 18 },
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

          {/* Portfolio */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Portfolio
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">$87.4k</p>
            <p className="mt-1 text-xs text-success">+8.3% all time</p>
            <div className="mt-4 space-y-2">
              {[
                { name: "Stocks", pct: 55, color: "bg-accent" },
                { name: "Bonds", pct: 25, color: "bg-chart-2" },
                { name: "Crypto", pct: 20, color: "bg-chart-3" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className={`size-2 rounded-full ${item.color}`} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="ml-auto font-medium text-foreground">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
