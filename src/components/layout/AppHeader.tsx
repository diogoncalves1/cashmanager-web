"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname /*, useRouter*/ } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Wallet,
  Target,
  TrendingDown,
  Users,
  Home,
  Wrench,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

import { NotificationDropdown } from "@/features/notifications";
import UserDropdown from "@/components/header/UserDropdown";
import { useAuth } from "@/features/auth";
import { useSidebar } from "@/context/SidebarContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { cn } from "@/shared/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubItem {
  name: string;
  path: string;
  new?: boolean;
}

interface NavGroup {
  heading: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  items: SubItem[];
}

interface NavEntry {
  name: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  path?: string;
  new?: boolean;
  // Dropdown "mega-menu" com várias colunas/secções (ex: Finanças)
  groups?: NavGroup[];
  // Dropdown simples de coluna única (ex: Tools, que vai crescer no futuro)
  items?: SubItem[];
}

// ─── Small badge ──────────────────────────────────────────────────────────────

const NewBadge = () => (
  <span className="ml-1.5 rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500">
    Novo
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AppHeader: React.FC = () => {
  const { user } = useAuth();
  // const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LAYOUTS");

  // Reaproveita o contexto da sidebar apenas para controlar o menu mobile
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = useCallback((path: string) => pathname.includes(path), [pathname]);

  // ─── Nav Items (equivalente ao antigo AppSidebar) ──────────────────────────

  const navItems = useMemo<NavEntry[]>(
    () => [
      {
        icon: Home,
        name: t("SIDEBAR_HOME"),
        path: "/dashboard",
      },
      {
        icon: Wallet,
        name: t("SIDEBAR_FINANCES"),
        groups: [
          {
            heading: t("SIDEBAR_ACCOUNTS"),
            icon: Wallet,
            items: [
              { name: t("SIDEBAR_ACCOUNTS"), path: "/accounts" },
              { name: t("SIDEBAR_TRANSACTIONS"), path: "/transactions" },
              { name: t("SIDEBAR_INVITES"), path: "/invitations/accounts" },
            ],
          },
          {
            heading: t("SIDEBAR_FINANCIAL_GOALS"),
            icon: Target,
            items: [
              { name: t("SIDEBAR_FINANCIAL_GOALS"), path: "/financial-goals" },
              { name: t("SIDEBAR_TRANSACTIONS"), path: "/financial-goal-transactions" },
              { name: t("SIDEBAR_INVITES"), path: "/invitations/financial-goals" },
            ],
          },
          {
            heading: t("SIDEBAR_DEBTS"),
            icon: TrendingDown,
            items: [
              { name: t("SIDEBAR_DEBTS"), path: "/debts" },
              { name: t("SIDEBAR_DEBT_PAYMENTS"), path: "/debt-payments" },
              { name: t("SIDEBAR_INVITES"), path: "/invitations/debts" },
            ],
          },
        ],
      },
      {
        icon: RefreshCw,
        name: t("SIDEBAR_RECURRING"),
        path: "/recurring",
        new: true,
      },
      {
        icon: Users,
        name: t("SIDEBAR_FRIENDS"),
        path: "/friends",
      },
      {
        icon: Wrench,
        name: t("SIDEBAR_TOOLS"),
        items: [
          { name: t("SIDEBAR_CURRENCY_CONVERTER"), path: "/converter", new: true },
          // Futuras tools entram aqui
        ],
      },
    ],
    [t]
  );

  // Fecha dropdown ao mudar de rota
  useEffect(() => {
    setOpenMenu(null);
    setOpenMobileGroup(null);
  }, [pathname]);

  // Limpa timeout pendente ao desmontar
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenMenu(name);
  };

  const handleMouseLeave = () => {
    // pequeno delay para não fechar ao passar entre o botão e o dropdown
    closeTimeoutRef.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const handleMobileNavigate = () => {
    if (isMobileOpen) toggleMobileSidebar();
  };

  // ─── Render: item de navegação desktop ─────────────────────────────────────

  const renderDesktopItem = (item: NavEntry) => {
    const hasGroups = !!item.groups?.length;
    const hasItems = !!item.items?.length;
    const hasDropdown = hasGroups || hasItems;
    const hasActiveChild =
      item.groups?.some((g) => g.items.some((s) => isActive(s.path))) ??
      item.items?.some((s) => isActive(s.path)) ??
      false;
    const active = item.path ? isActive(item.path) : hasActiveChild;
    const isOpen = openMenu === item.name;

    const triggerClass = cn(
      "flex items-center gap-2 rounded-md border-gray-200 px-4 py-3 text-[15px] font-ligth transition-colors whitespace-nowrap",
      active
        ? "bg-success-50 text-success-700 dark:border-success-800/50 dark:bg-success-900/15 dark:text-success-400"
        : "border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
    );

    if (!hasDropdown && item.path) {
      return (
        <Link key={item.name} href={item.path} className={triggerClass}>
          <item.icon size={14} strokeWidth={1.75} />
          {item.name}
          {item.new && <NewBadge />}
        </Link>
      );
    }

    return (
      <div
        key={item.name}
        className="relative"
        onMouseEnter={() => handleMouseEnter(item.name)}
        onMouseLeave={handleMouseLeave}
      >
        <button type="button" className={triggerClass} aria-expanded={isOpen}>
          <item.icon size={14} strokeWidth={1.75} />
          {item.name}
          <ChevronDown
            size={12}
            strokeWidth={2}
            className={cn("transition-transform duration-150", isOpen && "rotate-180")}
          />
        </button>

        {isOpen && (
          <>
            {/* ponte invisível para o cursor não "perder" o hover entre o botão e o dropdown */}
            <div className="absolute left-0 top-full h-1.5 w-full" />

            {/* Mega-menu com colunas/secções */}
            {hasGroups && (
              <div className="absolute left-0 top-[calc(100%+6px)] z-50 flex min-w-[560px] gap-6 rounded-xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {item.groups!.map((group) => (
                  <div key={group.heading} className="flex-1 min-w-[150px]">
                    <div className="mb-2 flex items-center gap-1.5 text-[14px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-600">
                      <group.icon size={12} strokeWidth={2} />
                      {group.heading}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {group.items.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                            sub.path === pathname
                              ? "font-medium text-success-600 dark:text-success-400"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                          )}
                        >
                          <span
                            className={cn(
                              "size-1 rounded-full bg-current",
                              sub.path === pathname ? "opacity-100" : "opacity-40"
                            )}
                          />
                          {sub.name}
                          {sub.new && <NewBadge />}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropdown simples de coluna única (ex: Tools) */}
            {hasItems && !hasGroups && (
              <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[210px] rounded-lg border border-gray-100 bg-white py-1.5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {item.items!.map((sub) => (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-[13px] transition-colors",
                      sub.path === pathname
                        ? "font-medium text-success-600 dark:text-success-400"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1 rounded-full bg-current",
                        sub.path === pathname ? "opacity-100" : "opacity-40"
                      )}
                    />
                    {sub.name}
                    {sub.new && <NewBadge />}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ─── Render: item de navegação mobile (mantém-se por clique/acordeão) ──────

  const renderMobileItem = (item: NavEntry) => {
    const hasGroups = !!item.groups?.length;
    const hasItems = !!item.items?.length;
    const hasDropdown = hasGroups || hasItems;
    const hasActiveChild =
      item.groups?.some((g) => g.items.some((s) => isActive(s.path))) ??
      item.items?.some((s) => isActive(s.path)) ??
      false;
    const active = item.path ? isActive(item.path) : hasActiveChild;
    const isOpen = openMobileGroup === item.name;

    if (!hasDropdown && item.path) {
      return (
        <Link
          key={item.name}
          href={item.path}
          onClick={handleMobileNavigate}
          className={cn(
            "flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium",
            active
              ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800/50 dark:bg-success-900/15 dark:text-success-400"
              : "border-transparent text-gray-600 dark:text-gray-300"
          )}
        >
          <item.icon size={16} strokeWidth={1.75} />
          {item.name}
          {item.new && <NewBadge />}
        </Link>
      );
    }

    return (
      <div key={item.name}>
        <button
          type="button"
          onClick={() => setOpenMobileGroup((prev) => (prev === item.name ? null : item.name))}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium",
            active
              ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800/50 dark:bg-success-900/15 dark:text-success-400"
              : "border-transparent text-gray-600 dark:text-gray-300"
          )}
        >
          <item.icon size={16} strokeWidth={1.75} />
          <span className="flex-1 text-left">{item.name}</span>
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-150", isOpen && "rotate-180")}
          />
        </button>
        {isOpen && hasGroups && (
          <div className="ml-8 flex flex-col gap-3 border-l border-gray-100 pl-3 pt-2 dark:border-gray-800">
            {item.groups!.map((group) => (
              <div key={group.heading} className="flex flex-col gap-0.5">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-600">
                  {group.heading}
                </p>
                {group.items.map((sub) => (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    onClick={handleMobileNavigate}
                    className={cn(
                      "rounded-md px-2 py-2 text-[13px]",
                      sub.path === pathname
                        ? "font-medium text-success-600 dark:text-success-400"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
        {isOpen && hasItems && !hasGroups && (
          <div className="ml-8 flex flex-col gap-0.5 border-l border-gray-100 pl-3 pt-2 dark:border-gray-800">
            {item.items!.map((sub) => (
              <Link
                key={sub.path}
                href={sub.path}
                onClick={handleMobileNavigate}
                className={cn(
                  "rounded-md px-2 py-2 text-[13px]",
                  sub.path === pathname
                    ? "font-medium text-success-600 dark:text-success-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ─── JSX ────────────────────────────────────────────────────────────────────

  return (
    <header
      style={{ zIndex: 50 }}
      className="sticky top-0 flex h-[85px] w-full flex-col bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 shadow-xs"
    >
      <div className="mx-auto flex h-full w-full items-center gap-2 px-1 xl:px-60">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center shrink-0">
          <Image
            className="dark:hidden"
            src="/images/logo/logo-transparent.png"
            alt="Logo"
            width={60}
            height={28}
          />
          <Image
            className="hidden dark:block"
            src="/images/logo/logo-transparent.png"
            alt="Logo"
            width={60}
            height={28}
          />
        </Link>

        {/* Quick links */}
        <div className="hidden lg:flex items-center gap-1 ml-8">
          {navItems.map(renderDesktopItem)}
        </div>

        {/* Espaço vazio entre os quick links e os controlos */}
        <div className="flex-1" />

        {/* Right side: switch controls */}
        <div className="flex items-center gap-2 2xsm:gap-3">
          <div className="hidden sm:flex items-center gap-2 2xsm:gap-3">
            <LanguageSwitcher variant="minimal" />
            <NotificationDropdown />
          </div>
          <UserDropdown user={user} />

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMobileSidebar}
            className="flex items-center justify-center w-9 h-9 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {isMobileOpen && (
        <div className="flex flex-col gap-1 border-t border-gray-100 px-3 py-3 lg:hidden dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3 px-3 pb-2">
            <LanguageSwitcher variant="minimal" />
            <NotificationDropdown />
          </div>
          {navItems.map(renderMobileItem)}
        </div>
      )}
    </header>
  );
};

export default AppHeader;
