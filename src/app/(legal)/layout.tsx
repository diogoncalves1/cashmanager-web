"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("LEGAL");

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg">
              <Image src="/images/logo/logo-transparent.png" alt="Logo" width={200} height={100} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Cash Manager
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="minimal" />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-1.5 size-4" />
                {t("BACK_TO_HOME")}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">{children}</main>

      {/* Simple footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              {`${new Date().getFullYear()} Cash Manager. ${t("ALL_RIGHTS_RESERVED")}.`}
            </p>
            <nav className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("PRIVACY_POLICY")}
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("TERMS_OF_SERVICE")}
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("COOKIE_POLICY")}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
