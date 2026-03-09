import { Shield, UserCheck, Share2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function SocialSection() {
  const t = useTranslations("LANDING");

  const capabilities = [
    {
      icon: UserCheck,
      title: t("FRIENDSHIP_SYSTEM"),
      description: t("FRIENDSHIP_SYSTEM_TEXT"),
    },
    {
      icon: Lock,
      title: t("PERMISSION_BASED_ACCESS"),
      description: t("PERMISSION_BASED_ACCESS_TEXT"),
    },
    {
      icon: Share2,
      title: t("SECURE_SHARING"),
      description: t("SECURE_SHARING_TEXT"),
    },
    {
      icon: Shield,
      title: t("COLLABORATIVE_TRACKING"),
      description: t("COLLABORATIVE_TRACKING_TEXT"),
    },
  ];
  return (
    <section id="social" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              {t("SOCIAL_FINANCE")}
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("SOCIAL_FINANCE_TITLE")}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {t("SOCIAL_FINANCE_SECTION_TEXT")}
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
            <p className="text-sm font-medium text-muted-foreground">{t("SHARED_GOAL")}</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">{t("FAMILY_SAVINGS")}</h3>
            <div className="mt-4 flex items-center gap-2">
              <Badge
                // variant="outline"
                className="border-success/30 bg-success/10 text-success text-xs"
              >
                {t("SHARED")}
              </Badge>
              <Badge color="success" className="text-xs bg-black/30">
                3 {t("MEMBERS")}
              </Badge>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { name: "Alex J.", role: t("CREATOR"), initials: "AJ", color: "bg-accent" },
                { name: "Sam W.", role: t("ADMINISTRATOR"), initials: "SW", color: "bg-chart-2" },
                { name: "Jordan L.", role: t("VIEWER"), initials: "JL", color: "bg-chart-3" },
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
                <span className="text-xs text-muted-foreground">{t("COMBINED_BALANCE")}</span>
                <span className="text-lg font-bold text-foreground">
                  {t("COMBINED_BALANCE_AMOUNT")}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[82%] rounded-full bg-accent" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                82% {t("COMBINED_BALANCE_TOTAL")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
