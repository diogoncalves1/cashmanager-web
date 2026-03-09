"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("LANDING");

  const links = [
    { href: "#features", label: t("FEATURES") },
    { href: "#how-it-works", label: t("HOW_IT_WORKS") },
    { href: "#social", label: t("SOCIAL") },
    { href: "#dashboard", label: t("DASHBOARD") },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg">
            <Image src="/images/logo/logo-transparent.png" alt="Logo" width={200} height={100} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">Cash Manager</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signin">{t("LOG_IN")}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">{t("GET_STARTED_FREE")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/40 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">{t("LOG_IN")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">{t("GET_STARTED_FREE")}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
