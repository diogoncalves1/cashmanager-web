"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { BoxCubeIcon, HorizontaLDots, PageIcon, PlugInIcon } from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import {
  PieChartIcon,
  TableIcon,
  ChevronRight,
  Wallet,
  CalendarIcon,
  ArrowLeftRight,
  Target,
  TrendingDown,
  Settings,
  DoorOpen,
  Briefcase,
  TrendingUp,
  User,
  Users,
  Coins,
  Calculator,
  LayoutDashboard,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  disable?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  background?: string;
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={18} strokeWidth={2} />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <CalendarIcon size={18} strokeWidth={2} />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <Wallet size={18} strokeWidth={2} />,
    name: "Accounts",
    path: "/accounts",
  },
  {
    icon: <ArrowLeftRight size={18} strokeWidth={2} />,
    name: "Transactions",
    path: "/transactions",
  },
  {
    icon: <Target size={18} strokeWidth={2} />,
    name: "Financial Goals",
    disable: true,
    subItems: [
      { name: "Financial Goals", path: "/financial-goals", pro: false },
      { name: "Contributions", path: "/financial-goals/contributions", pro: false },
      {
        name: "Scheduled Contributions",
        path: "/financial-goals/contributions/scheduled",
        pro: false,
      },
    ],
  },
  {
    icon: <TrendingDown size={18} strokeWidth={2} />,
    name: "Debts",
    disable: true,
    subItems: [
      { name: "Debts", path: "/debts", pro: false },
      { name: "Payments", path: "/debts/payments", pro: false },
      { name: "Scheduled Payments", path: "/debts/payments/scheduled", pro: false },
    ],
  },
  {
    icon: <Briefcase size={18} strokeWidth={2} />,
    name: "Portfolio",
    disable: true,
    path: "/portfolio",
  },
  {
    icon: <TrendingUp size={18} strokeWidth={2} />,
    name: "Stocks",
    disable: false,
    subItems: [
      { name: "Stocks", path: "/stocks", pro: false },
      { name: "Stocks Search", path: "/stocks/search", pro: false },
      { name: "Watchlist", path: "/stocks/watchlist", pro: false },
    ],
  },
  // {
  //   icon: <ListIcon size={18} strokeWidth={2} />,
  //   name: "Forms",
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon size={18} strokeWidth={2} />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon size={18} strokeWidth={2} />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
];

const socialItems: NavItem[] = [
  {
    icon: <User size={18} strokeWidth={2} />,
    name: "Profile",
    path: "/profile",
  },
  {
    icon: <Users size={18} strokeWidth={2} />,
    name: "Friends",
    path: "/friends",
  },
];

const toolsItems: NavItem[] = [
  {
    icon: <Coins size={18} strokeWidth={2} />,
    name: "Currency Converter",
    path: "/tools/currency-converter",
  },
  {
    icon: <Calculator size={18} strokeWidth={2} />,
    name: "Comp. Int. Calculator",
    path: "/tools/compound-interest-calculator",
  },
];

const settingsItems: NavItem[] = [
  {
    icon: <Settings size={18} strokeWidth={2} />,
    name: "Settings",
    path: "/settings",
  },
  {
    icon: <DoorOpen size={18} strokeWidth={2} />,
    name: "Logout",
    path: "/logout",
    // background: "bg-error-500 text-white"
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others" | "settings" | "tools" | "social"
  ) => (
    <ul className="flex flex-col">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
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
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
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
  }, [pathname, isActive]);

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
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 sidebar-cat text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>

            <div className="">
              <h2
                className={`mb-4 sidebar-cat text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Social" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(socialItems, "social")}
            </div>

            <div className="">
              <h2
                className={`mb-4 sidebar-cat text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Tools" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(toolsItems, "tools")}
            </div>

            <div className="">
              <h2
                className={`mb-4 sidebar-cat text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Settings" : <HorizontaLDots />}
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
