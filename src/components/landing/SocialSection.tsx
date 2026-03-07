import { Shield, UserCheck, Share2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  {
    icon: UserCheck,
    title: "Friendship System",
    description:
      "Add trusted contacts and manage your financial circle with a familiar, social-media-style friend system.",
  },
  {
    icon: Lock,
    title: "Permission-Based Access",
    description:
      "Control exactly what each person can see or do. Grant view-only or participant access per account, debt, or goal.",
  },
  {
    icon: Share2,
    title: "Secure Sharing",
    description:
      "Share accounts, debts, goals, and portfolios with end-to-end encrypted connections. Your data never leaves your control.",
  },
  {
    icon: Shield,
    title: "Collaborative Tracking",
    description:
      "Work together on shared expenses, joint debts, or family savings goals with real-time updates for everyone.",
  },
];

export function SocialSection() {
  return (
    <section id="social" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Social Finance
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Manage money together, not alone
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Financial management is better when shared. Invite friends, family, or partners to
              collaborate on shared goals, track joint expenses, and hold each other accountable.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {capabilities.map((cap) => (
                <div key={cap.title} className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <cap.icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{cap.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {cap.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Mock UI */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-6 shadow-xl shadow-accent/5">
            <p className="text-sm font-medium text-muted-foreground">Shared Account</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">Family Savings</h3>
            <div className="mt-4 flex items-center gap-2">
              <Badge
                // variant="outline"
                className="border-success/30 bg-success/10 text-success text-xs"
              >
                Shared
              </Badge>
              <Badge color="success" className="text-xs bg-black/30">
                3 members
              </Badge>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { name: "Alex J.", role: "Owner", initials: "AJ", color: "bg-accent" },
                { name: "Sam W.", role: "Participant", initials: "SW", color: "bg-chart-2" },
                { name: "Jordan L.", role: "View Only", initials: "JL", color: "bg-chart-3" },
              ].map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-lg border border-border/30 bg-background/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-8 items-center justify-center rounded-full ${member.color} text-xs font-semibold text-accent-foreground`}
                    >
                      {member.initials}
                    </div>
                    <span className="text-sm font-medium text-foreground">{member.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{member.role}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Combined Balance</span>
                <span className="text-lg font-bold text-foreground">$45,230.00</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[82%] rounded-full bg-accent" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">82% of $55,000 goal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
