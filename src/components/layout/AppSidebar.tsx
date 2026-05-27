"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { HorizontaLDots } from "@/icons/index";
import {
  ChevronRight,
  Wallet,
  Target,
  TrendingDown,
  Settings,
  DoorOpen,
  Users,
  Home,
  Coins,
  MoreVertical,
} from "lucide-react";
import { onLogout, useAuth } from "@/features/auth";
import { SwalToast } from "@/components/swal/SwalToast";
import { useTranslations } from "next-intl";
import { cn, getUserColor, getUserInitials } from "@/shared/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@/shared/types/user";

// ─── Types ────────────────────────────────────────────────────────────────────

type MenuType = "main" | "social" | "tools" | "settings";

interface SubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path?: string;
  disable?: boolean;
  new?: boolean;
  pro?: boolean;
  onClick?: () => void | Promise<void>;
  subItems?: SubItem[];
  destructive?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ItemBadge = ({ type, active }: { type: "new" | "pro"; active: boolean }) => (
  <span
    className={cn(
      "ml-auto rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
      type === "new"
        ? active
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500"
        : active
          ? "bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400"
          : "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-500"
    )}
  >
    {type}
  </span>
);

const ItemBadges = ({
  item,
  isActive,
}: {
  item: Pick<NavItem | SubItem, "new" | "pro">;
  isActive: boolean;
}) => (
  <>
    {item.new && <ItemBadge type="new" active={isActive} />}
    {item.pro && <ItemBadge type="pro" active={isActive} />}
  </>
);

interface SidebarSectionProps {
  label: string;
  isVisible: boolean;
  children: React.ReactNode;
}

const SidebarSection = ({ label, isVisible, children }: SidebarSectionProps) => (
  <div className="flex flex-col gap-0.5">
    <p
      className={cn(
        "flex items-center px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-600 transition-all duration-200",
        !isVisible && "lg:justify-center lg:opacity-0 lg:h-0 lg:py-0 lg:overflow-hidden"
      )}
    >
      {isVisible ? label : <HorizontaLDots className="size-3" />}
    </p>
    {children}
  </div>
);

// ─── User Card (Footer) ───────────────────────────────────────────────────────

interface UserCardProps {
  isVisible: boolean;
  user: User;
}

const UserCard = ({ isVisible, user }: UserCardProps) => (
  <div
    className={cn(
      "flex items-center gap-2.5 rounded-lg px-2 py-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
      !isVisible && "lg:justify-center"
    )}
  >
    <Avatar className={cn("size-7 min-w-[28px] items-center", getUserColor(user?.name))}>
      <AvatarFallback className={cn("text-[11px] font-medium", getUserColor(user?.name))}>
        {getUserInitials(user?.name)}
      </AvatarFallback>
    </Avatar>

    {isVisible && (
      <>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
            {user.name}
          </p>
          {/* <p className="text-[11px] text-gray-400 dark:text-gray-600">Plano Free</p> */}
        </div>
        {/* <MoreVertical className="size-3.5 shrink-0 text-gray-400" /> */}
      </>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AppSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const t = useTranslations("LAYOUTS");
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const isVisible = isExpanded || isHovered || isMobileOpen;

  const [openSubmenu, setOpenSubmenu] = useState<{ type: MenuType; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => pathname.includes(path), [pathname]);

  // ─── Nav Items ──────────────────────────────────────────────────────────────

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        icon: <Home size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_HOME"),
        path: "/dashboard",
      },
      {
        icon: <Wallet size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_ACCOUNTS"),
        subItems: [
          { name: t("SIDEBAR_ACCOUNTS"), path: "/accounts" },
          { name: t("SIDEBAR_TRANSACTIONS"), path: "/transactions" },
          { name: t("SIDEBAR_INVITES"), path: "/invitations/accounts" },
        ],
      },
      {
        icon: <Target size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_FINANCIAL_GOALS"),
        subItems: [
          { name: t("SIDEBAR_FINANCIAL_GOALS"), path: "/financial-goals" },
          { name: t("SIDEBAR_TRANSACTIONS"), path: "/financial-goal-transactions" },
          { name: t("SIDEBAR_INVITES"), path: "/invitations/financial-goals" },
        ],
      },
      {
        icon: <TrendingDown size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_DEBTS"),
        subItems: [
          { name: t("SIDEBAR_DEBTS"), path: "/debts" },
          { name: t("SIDEBAR_DEBT_PAYMENTS"), path: "/debt-payments" },
          { name: t("SIDEBAR_INVITES"), path: "/invitations/debts" },
        ],
      },
    ],
    [t]
  );

  const socialItems = useMemo<NavItem[]>(
    () => [
      {
        icon: <Users size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_FRIENDS"),
        path: "/friends",
      },
    ],
    [t]
  );

  const toolsItems = useMemo<NavItem[]>(
    () => [
      {
        icon: <Coins size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_CURRENCY_CONVERTER"),
        path: "/converter",
        new: true,
      },
    ],
    [t]
  );

  const settingsItems = useMemo<NavItem[]>(
    () => [
      {
        icon: <Settings size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_SETTINGS"),
        path: "/settings",
      },
      {
        icon: <DoorOpen size={16} strokeWidth={1.75} />,
        name: t("SIDEBAR_LOGOUT"),
        path: "#",
        destructive: true,
        onClick: async () => {
          const success = await onLogout(t);
          if (!success) SwalToast({ message: t("LOGOUT_ERROR"), icon: "error" });
          router.push("/signin");
        },
      },
    ],
    [t, router]
  );

  const sections = useMemo<{ key: MenuType; label: string; items: NavItem[] }[]>(
    () => [
      { key: "main", label: t("SIDEBAR_MENU"), items: navItems },
      { key: "social", label: t("SIDEBAR_SOCIAL"), items: socialItems },
      { key: "tools", label: t("SIDEBAR_TOOLS"), items: toolsItems },
      { key: "settings", label: t("SIDEBAR_SETTINGS"), items: settingsItems },
    ],
    [t, navItems, socialItems, toolsItems, settingsItems]
  );

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const matched = navItems.some((nav, index) =>
      nav.subItems?.some((subItem) => {
        if (isActive(subItem.path)) {
          setOpenSubmenu({ type: "main", index });
          return true;
        }
        return false;
      })
    );
    if (!matched) setOpenSubmenu(null);
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    if (!openSubmenu) return;
    const key = `${openSubmenu.type}-${openSubmenu.index}`;
    const el = subMenuRefs.current[key];
    if (el) setSubMenuHeight((prev) => ({ ...prev, [key]: el.scrollHeight }));
  }, [openSubmenu]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSubmenuToggle = useCallback((index: number, menuType: MenuType) => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index ? null : { type: menuType, index }
    );
  }, []);

  // ─── Render Helpers ─────────────────────────────────────────────────────────

  const renderSubItems = (subItems: SubItem[]) => (
    <ul className="mt-0.5 space-y-0.5">
      {subItems.map((subItem) => (
        <li key={subItem.name}>
          <Link
            href={subItem.path}
            className={cn(
              "group flex items-center gap-2 rounded-md py-1.5 pl-9 pr-3 text-[12px] transition-colors",
              subItem.path === pathname
                ? "font-medium text-success-600 dark:text-success-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            )}
          >
            <span
              className={cn(
                "size-1 rounded-full bg-current transition-opacity",
                subItem.path === pathname ? "opacity-100" : "opacity-40 group-hover:opacity-70"
              )}
            />
            {subItem.name}
            <ItemBadges item={subItem} isActive={isActive(subItem.path)} />
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderNavItem = (nav: NavItem, index: number, menuType: MenuType) => {
    const submenuKey = `${menuType}-${index}`;
    const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
    const hasActiveChild = nav.subItems?.some((item) => isActive(item.path)) ?? false;
    const itemIsActive = nav.path ? isActive(nav.path) : hasActiveChild;

    const itemClass = cn(
      "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all duration-150",
      nav.disable && "pointer-events-none opacity-40",
      nav.destructive
        ? "text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/40"
        : itemIsActive
          ? "bg-success-50 font-medium text-success-700 dark:bg-success-900/20 dark:text-success-400"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    );

    const iconClass = cn(
      "shrink-0 transition-colors",
      nav.destructive
        ? "text-red-400 group-hover:text-red-500"
        : itemIsActive
          ? "text-success-500 dark:text-success-400"
          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
    );

    const content = nav.subItems ? (
      <>
        <button
          onClick={() => !nav.disable && handleSubmenuToggle(index, menuType)}
          className={itemClass}
          aria-expanded={isSubmenuOpen}
        >
          <span className={iconClass}>{nav.icon}</span>
          {isVisible && (
            <>
              <span className="flex-1 truncate text-left">{nav.name}</span>
              <ChevronRight
                size={12}
                strokeWidth={2}
                className={cn(
                  "shrink-0 text-gray-300 transition-transform duration-200 dark:text-gray-600",
                  isSubmenuOpen && "rotate-90"
                )}
              />
            </>
          )}
        </button>

        {isVisible && (
          <div
            ref={(el) => {
              subMenuRefs.current[submenuKey] = el;
            }}
            className="overflow-hidden transition-all duration-250 ease-in-out"
            style={{
              height: isSubmenuOpen ? `${subMenuHeight[submenuKey] ?? 0}px` : "0px",
            }}
          >
            {renderSubItems(nav.subItems)}
          </div>
        )}
      </>
    ) : nav.path ? (
      <Link href={nav.disable ? "#" : nav.path} className={itemClass} onClick={nav.onClick}>
        <span className={iconClass}>{nav.icon}</span>
        {isVisible && (
          <>
            <span className="flex-1 truncate">{nav.name}</span>
            <ItemBadges item={nav} isActive={itemIsActive} />
          </>
        )}
      </Link>
    ) : null;

    if (!isVisible && !nav.subItems) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {nav.name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  const renderMenuItems = (items: NavItem[], menuType: MenuType) => (
    <ul className="flex flex-col gap-0.5">
      {items.map((nav, index) => (
        <li key={nav.name}>{renderNavItem(nav, index, menuType)}</li>
      ))}
    </ul>
  );

  // ─── JSX ────────────────────────────────────────────────────────────────────

  return (
    <aside
      style={{ zIndex: 50 }}
      className={cn(
        "fixed top-0 left-0 flex h-screen flex-col border-r border-gray-100 bg-white px-2 shadow-sm transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:mt-0",
        isVisible ? "w-[235px]" : "w-[90px]",
        isMobileOpen ? "translate-x-1" : "-translate-x-full",
        "lg:translate-x-0"
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2.5 border-b border-gray-100 py-4 dark:border-gray-800",
          !isVisible ? "justify-center px-1" : "px-2"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5">
          {isVisible ? (
            <Image
              src="/images/logo/logo-long.png"
              alt="Logo"
              width={120}
              height={32}
              className="not-subitem"
            />
          ) : (
            <Image src="/images/logo/logo-transparent.png" alt="Logo" width={28} height={28} />
          )}
        </Link>
      </div>

      {/* Nav */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 no-scrollbar">
        {sections.map(({ key, label, items }, sectionIndex) => (
          <React.Fragment key={key}>
            {/* Divider before settings */}
            {sectionIndex === sections.length - 1 && (
              <div className="mx-2 border-t border-gray-100 dark:border-gray-800" />
            )}
            <SidebarSection label={label} isVisible={isVisible}>
              {renderMenuItems(items, key)}
            </SidebarSection>
          </React.Fragment>
        ))}
      </div>

      {/* Footer — User Card */}
      <div className="border-t border-gray-100 py-2 dark:border-gray-800">
        <UserCard isVisible={isVisible} user={user} />
      </div>
    </aside>
  );
};

export default AppSidebar;
