"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, CheckCheck } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { notificationApi } from "@/features/notifications/api/notification.api";
import { useAuth } from "@/features/auth";
import { useTranslations } from "next-intl";
import type { TabFilter } from "@/features/notifications/types";
import NotificationListItem from "@/features/notifications/components/list/NotificationListItem";
import { EmptyState } from "@/features/notifications/components/ui/NotificationEmptyState";
import { NotificationSkeleton } from "../list/NotificationSkeleton";
import { NotificationDetail } from "../detail/NotificationDetail";

export const NotificationContainer = () => {
  const { user } = useAuth();
  const t = useTranslations("NOTIFICATIONS");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TabFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    readAll,
    read,
  } = useNotifications();

  // ── Mobile detection ──────────────────────────────────────────────────────

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Infinite scroll sentinel ──────────────────────────────────────────────

  const sentinelRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelect = (id: string, readAt: string) => {
    setSelectedId(id);
    if (!readAt) read(id);
    if (isMobile) setMobileDetailOpen(true);
  };

  const handleClose = () => {
    setSelectedId(null);
    setMobileDetailOpen(false);
  };

  const handleMarkAsRead = useCallback(async (id: string) => {
    await notificationApi.read(id);
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (search) {
        const q = search.toLowerCase();
        if (!n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q))
          return false;
      }
      if (filter === "unread" && n.readAt) return false;
      return true;
    });
  }, [notifications, search, filter]);

  const selectedNotification = useMemo(
    () => notifications.find((n) => n.id === selectedId) ?? null,
    [notifications, selectedId]
  );

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: t("TAB_ALL") },
    { key: "unread", label: t("TAB_UNREAD") },
  ];

  return (
    <div className="flex h-[calc(90vh-8rem)] flex-col">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {t("NOTIFICATIONS")}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} ${t("UNREAD")}` : t("ALL_CAUGHT_UP")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={readAll}
          disabled={unreadCount === 0}
          className="h-8 rounded-lg text-xs"
        >
          <CheckCheck className="mr-1.5 size-3.5" />
          {t("MARK_ALL_READ")}
        </Button>
      </div>

      {/* Search + Tabs */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t("SEARCH_PLACEHOLDER")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 rounded-lg pl-8 text-xs"
          />
        </div>

        <div className="flex gap-1 border-b border-gray-100 dark:border-gray-800 sm:border-0">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs transition-colors",
                filter === key
                  ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mt-4 flex min-h-0 flex-1 gap-0 overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* List */}
        <div className="flex w-full flex-col overflow-hidden border-r border-gray-100 dark:border-gray-800 lg:w-2/5">
          {isLoading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <ul className="flex-1 space-y-0.5 overflow-y-auto p-2 [scrollbar-width:thin]">
              {filteredNotifications.map((notification) => (
                <li key={notification.id}>
                  <NotificationListItem
                    notification={notification}
                    isSelected={selectedId === notification.id}
                    onClick={() => handleSelect(notification.id, notification.readAt)}
                    user={user}
                  />
                </li>
              ))}
              <li ref={sentinelRef} className="flex justify-center py-4">
                {isFetchingMore && <Loader2 className="size-4 animate-spin text-gray-300" />}
              </li>
            </ul>
          )}
        </div>

        {/* Detail panel — desktop */}
        <div className="hidden flex-1 lg:flex">
          <div className="w-full">
            <NotificationDetail
              notification={selectedNotification}
              onClose={handleClose}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </div>
      </div>

      {/* Detail panel — mobile bottom sheet */}
      <Sheet open={mobileDetailOpen && isMobile} onOpenChange={setMobileDetailOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("NOTIFICATION_DETAILS")}</SheetTitle>
            <SheetDescription>{t("NOTIFICATION_DETAILS_DESCRIPTION")}</SheetDescription>
          </SheetHeader>
          <NotificationDetail
            notification={selectedNotification}
            onClose={handleClose}
            onMarkAsRead={handleMarkAsRead}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
