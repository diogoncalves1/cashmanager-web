"use client";

import { useState, useRef, useCallback } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { Bell, Loader2, X, CheckCheck, ArrowRight, Clock } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { timeAgo } from "@/shared/utils";
import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabFilter = "all" | "unread";

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
];

function getAvatarColor(str: string) {
  const i = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}

function getInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const NotificationAvatar = ({ title }: { title: string }) => (
  <div
    className={cn(
      "flex size-9 min-w-[36px] items-center justify-center rounded-full text-[11px] font-medium",
      getAvatarColor(title)
    )}
  >
    {getInitials(title)}
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ label }: { label: string }) => (
  <li className="flex flex-col items-center justify-center gap-3 py-10 text-gray-400 dark:text-gray-600">
    <Bell className="size-8 opacity-40" />
    <p className="text-xs">{label}</p>
  </li>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function NotificationDropdown() {
  const t = useTranslations("NOTIFICATIONS");
  const router = useRouter();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const { notifications, unreadCount, isLoading, isFetchingMore, hasMore, loadMore, readAll } =
    useNotifications();

  // ── Infinite scroll sentinel ──────────────────────────────────────────────

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (el: HTMLLIElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!el) return;
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) loadMore();
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(el);
    },
    [loadMore]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleBellClick = () => {
    toggleDropdown();
  };

  const handleNotificationClick = (pathname: string) => {
    router.push(pathname);
    closeDropdown();
  };

  const handleSeeAll = () => {
    router.push("/notifications");
    closeDropdown();
  };

  // ── Derived state ─────────────────────────────────────────────────────────

  const visibleNotifications =
    activeTab === "unread" ? notifications.filter((n) => !n.readAt) : notifications;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        aria-label={t("NOTIFICATIONS")}
        className="dropdown-toggle relative flex size-9 items-center justify-center rounded-full border border-transparent bg-white text-gray-500 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleBellClick}
      >
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex size-2 rounded-full bg-amber-400">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
          </span>
        )}
        <Bell className="size-[18px]" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:left-auto lg:right-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("NOTIFICATIONS")}
            </h5>
            {unreadCount > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                {unreadCount} {t("NEW")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={readAll}
              title={t("MARK_ALL_READ")}
              className="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <CheckCheck className="size-4" />
            </button>
            <button
              onClick={closeDropdown}
              className="dropdown-toggle flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 px-3 dark:border-gray-800">
          {(["all", "unread"] as TabFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "mb-[-0.5px] border-b-2 px-3 pb-2.5 pt-1 text-xs transition-colors",
                activeTab === tab
                  ? "border-violet-500 font-medium text-gray-900 dark:text-gray-100"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              {tab === "all" ? t("TAB_ALL") : t("TAB_UNREAD")}
            </button>
          ))}
        </div>

        {/* List */}
        <ul className="flex max-h-[360px] flex-col overflow-y-auto [scrollbar-width:thin]">
          {isLoading ? (
            <li className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-gray-300" />
            </li>
          ) : visibleNotifications.length === 0 ? (
            <EmptyState label={t("NO_NOTIFICATIONS")} />
          ) : (
            <>
              {visibleNotifications.map((notification, key) => (
                <li
                  key={key}
                  onClick={() => handleNotificationClick(notification.pathname)}
                  className={cn(
                    "group relative flex cursor-pointer items-start gap-3 border-b border-gray-50 px-4 py-3 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5",
                    !notification.readAt && "bg-amber-50/50 dark:bg-amber-900/5"
                  )}
                >
                  <NotificationAvatar title={notification.title} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-800 dark:text-gray-100">
                      {notification.title}
                    </p>
                    <p className="mb-1.5 line-clamp-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600">
                      <Clock className="size-3" />
                      {timeAgo(user, notification.createdAt)}
                    </span>
                  </div>

                  {/* Unread indicator */}
                  {!notification.readAt && (
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                  )}
                </li>
              ))}

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <li ref={sentinelRef} className="flex justify-center py-3">
                  {isFetchingMore && <Loader2 className="size-4 animate-spin text-gray-300" />}
                </li>
              )}
            </>
          )}
        </ul>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <button
            onClick={handleSeeAll}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/5 dark:hover:text-gray-200"
          >
            {t("SEE_ALL")}
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
