import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function CtaSection() {
  const t = useTranslations("LANDING");
  return (
    <section className="border-t border-border/40 bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/5 px-6 py-16 sm:px-16 sm:py-20">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/3 size-[500px] rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("CTA_SECTION_TITLE")}
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              {t("CTA_SECTION_TEXT")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 px-8 text-base" asChild>
                <Link href="/signup">
                  {t("GET_STARTED_FREE")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">{t("NO_CREDIT_CARD_REQUIRED")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
