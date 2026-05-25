"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Bell, Loader2, X } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { timeAgo } from "@/shared/utils";
import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function NotificationDropdown() {
  const t = useTranslations("NOTIFICATIONS");
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    countNotifications,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    readAll,
  } = useNotifications();
  const router = useRouter();
  const { user } = useAuth();

  // ── Infinite scroll sentinel ──────────────────────────────────────────────
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (el: HTMLLIElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!el) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) loadMore();
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(el);
    },
    [loadMore]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleClick() {
    toggleDropdown();
    readAll();
  }

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white rounded-full hover:text-gray-700 h-9 w-9 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            countNotifications === 0 ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping" />
        </span>
        <Bell className="w-[20px] h-[20px]" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute left-0 mt-[17px] flex max-h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0 lg:left-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t("NOTIFICATIONS")}
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-[24px] w-[24px]" />
          </button>
        </div>

        {/* List */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <li className="flex justify-center p-6">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </li>
          ) : notifications.length === 0 ? (
            <li className="p-4 text-center text-gray-500 text-theme-sm">{t("NO_NOTIFICATIONS")}</li>
          ) : (
            <>
              {notifications.map((notification, key) => (
                <li
                  key={key}
                  onClick={() => {
                    router.push(notification.pathname);
                    closeDropdown();
                  }}
                >
                  <DropdownItem className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5">
                    <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                      <Image
                        width={40}
                        height={40}
                        src="/images/logo/logo-transparent.png"
                        alt="User"
                        className="w-full overflow-hidden rounded-full"
                      />
                    </span>
                    <span className="block">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {notification.title}
                      </span>
                      <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                        <span>{notification.message}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                        <span>{timeAgo(user, notification.createdAt)}</span>
                      </span>
                    </span>
                  </DropdownItem>
                </li>
              ))}

              {/* Sentinel — triggers loadMore when visible */}
              {hasMore && (
                <li ref={sentinelRef} className="flex justify-center py-3">
                  {isFetchingMore && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </li>
              )}
            </>
          )}
        </ul>
      </Dropdown>
    </div>
  );
}
