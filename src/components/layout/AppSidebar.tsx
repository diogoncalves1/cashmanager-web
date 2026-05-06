"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { HorizontaLDots } from "@/icons/index";
import { useRouter } from "next/navigation";
import SidebarWidget from "./SidebarWidget";
import {
  ChevronRight,
  Wallet,
  Target,
  TrendingDown,
  Settings,
  DoorOpen,
  Users,
  Home,
} from "lucide-react";
import { onLogout } from "@/services/auth/service";
import { SwalToast } from "@/components/swal/SwalToast";
import { useTranslations } from "next-intl";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  disable?: boolean;
  onClick?: () => void | Promise<void>;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  background?: string;
};

const AppSidebar: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("LAYOUTS");

  const navItems: NavItem[] = useMemo(
    () => [
      {
        icon: <Home size={18} strokeWidth={2} />,
        name: t("SIDEBAR_HOME"),
        path: "/dashboard",
      },
      {
        icon: <Wallet size={18} strokeWidth={2} />,
        name: t("SIDEBAR_ACCOUNTS"),
        subItems: [
          { name: t("SIDEBAR_ACCOUNTS"), path: "/accounts", pro: false },
          {
            name: t("SIDEBAR_TRANSACTIONS"),
            path: "/transactions",
            pro: false,
          },
          {
            name: t("SIDEBAR_INVITES"),
            path: "/account-invitations",
          },
        ],
      },
      {
        icon: <Target size={18} strokeWidth={2} />,
        name: t("SIDEBAR_FINANCIAL_GOALS"),
        subItems: [
          { name: t("SIDEBAR_FINANCIAL_GOALS"), path: "/financial-goals", pro: false },
          {
            name: t("SIDEBAR_TRANSACTIONS"),
            path: "/financial-goal-transactions",
            pro: false,
          },
          {
            name: t("SIDEBAR_INVITES"),
            path: "/financial-goal-invitations",
          },
        ],
      },
      {
        icon: <TrendingDown size={18} strokeWidth={2} />,
        name: t("SIDEBAR_DEBTS"),
        subItems: [
          { name: t("SIDEBAR_DEBTS"), path: "/debts", pro: false },
          { name: t("SIDEBAR_DEBT_PAYMENTS"), path: "/debt-payments", pro: false },
          {
            name: t("SIDEBAR_INVITES"),
            path: "/debt-invitations",
          },
        ],
      },
      // {
      //   icon: <Briefcase size={18} strokeWidth={2} />,
      //   name: t("SIDEBAR_PORTFOLIOS"),
      //   disable: true,
      //   path: "/portfolio",
      // },
      // {
      //   icon: <TrendingUp size={18} strokeWidth={2} />,
      //   name: t("SIDEBAR_STOCKS"),
      //   disable: true,
      //   subItems: [
      //     { name: t("SIDEBAR_STOCKS"), path: "/stocks", pro: false },
      //     { name: t("SIDEBAR_STOCKS_SEARCH"), path: "/stocks/search", pro: false },
      //     { name: t("SIDEBAR_STOCKS_WATCHLIST"), path: "/stocks/watchlist", pro: false },
      //   ],
      // },
    ],
    [t]
  );

  const socialItems: NavItem[] = [
    {
      icon: <Users size={18} strokeWidth={2} />,
      name: t("SIDEBAR_FRIENDS"),
      path: "/friends",
    },
  ];

  // const toolsItems: NavItem[] = [
  //   // {
  //   //   icon: <Coins size={18} strokeWidth={2} />,
  //   //   name: t("SIDEBAR_CURRENCY_CONVERTER"),
  //   //   path: "/tools/currency-converter",
  //   //   disable: true,
  //   // },
  //   // {
  //   //   icon: <Calculator size={18} strokeWidth={2} />,
  //   //   name: t("SIDEBAR_COMPOUND_INTEREST_CALCULATOR"),
  //   //   path: "/tools/compound-interest-calculator",
  //   //   disable: true,
  //   // },
  // ];
  const settingsItems: NavItem[] = [
    {
      icon: <Settings size={18} strokeWidth={2} />,
      name: t("SIDEBAR_SETTINGS"),
      path: "/settings",
    },
    {
      icon: <DoorOpen size={18} strokeWidth={2} />,
      name: t("SIDEBAR_LOGOUT"),
      path: "#",
      onClick: async () => {
        const logout = await onLogout(t);

        if (!logout) SwalToast({ message: t("LOGOUT_ERROR"), icon: "error" });

        router.push("/signin");
      },
      // background: "bg-error-500 text-white"
    },
  ];

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others" | "settings" | "tools" | "social"
  ) => (
    <ul className="flex flex-col">
      {navItems.map((nav, index) => (
        <li key={nav.name} onClick={nav.onClick}>
          {nav.subItems ? (
            <button
              onClick={() => (nav.disable ? {} : handleSubmenuToggle(index, menuType))}
              className={`menu-item group items-center ${nav.disable ? "disabled" : ""} ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : `menu-item-inactive ${
                      nav.subItems.some((item) => isActive(item.path)) ? "active" : ""
                    }`
              } cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronRight
                  size={12}
                  strokeWidth={2}
                  className={`transition-transform duration-200  ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-90"
                      : ""
                  }`}
                />
              )}
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : `menu-item-icon-inactive ${
                        nav.subItems.some((item) => isActive(item.path)) ? "active" : ""
                      }`
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.disable ? "#" : nav.path}
                className={`menu-item group not-subitem ${nav.disable == true ? "disabled" : ""} ${
                  nav.background
                } ${isActive(nav.path) ? "menu-item-active active" : "menu-item-inactive"}`}
              >
                <span
                  className={`${nav.background} ${
                    isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item pl-9 ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others" | "settings" | "tools" | "social";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => pathname.includes(path), [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others" | "settings" | "tools" | "social",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "others" | "settings" | "tools" | "social"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      style={{ zIndex: 50 }}
      className={`fixed mt-10 shadow-xl flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[235px]" : isHovered ? "w-[235px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden not-subitem"
                src="/images/logo/logo-long.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block not-subitem"
                src="/images/logo/logo-long.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image src="/images/logo/logo-transparent.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-3">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4  text-xs uppercase flex leading-[20px] sidebar-cat text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? t("SIDEBAR_MENU") : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 sidebar-cat text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? t("SIDEBAR_SOCIAL") : <HorizontaLDots />}
              </h2>
              {renderMenuItems(socialItems, "social")}
            </div>

            {/* <div className="">
              <h2
                className={`mb-4 sidebar-cat text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? t("SIDEBAR_TOOLS") : <HorizontaLDots />}
              </h2>
              {renderMenuItems(toolsItems, "tools")}
            </div> */}

            <div className="">
              <h2
                className={`mb-4 sidebar-cat text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t("SIDEBAR_SETTINGS")
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(settingsItems, "settings")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
