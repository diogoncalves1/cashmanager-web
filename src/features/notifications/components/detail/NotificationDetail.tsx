import { ArrowRight, Bell, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { NotificationAvatar } from "../ui/NotificationAvatar";
import { Notification } from "../../types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function formatFullDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotificationDetail({
  notification,
  onClose,
  onMarkAsRead,
}: {
  notification: Notification | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}) {
  const t = useTranslations("NOTIFICATIONS");

  if (!notification) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Bell className="size-7 text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("SELECT_NOTIFICATION")}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
            {t("SELECT_NOTIFICATION_DESCRIPTION")}
          </p>
        </div>
      </div>
    );
  }

  const isUnread = !notification.readAt;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 p-4 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <NotificationAvatar title={notification.title} size="lg" />
          <div className="min-w-0">
            <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
              {notification.title}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-600">
              {formatFullDate(notification.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
        >
          <X className="size-4" />
          <span className="sr-only">{t("CLOSE")}</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {notification.message}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-gray-800">
        {isUnread ? (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <Check className="size-3.5" />
            {t("MARK_READ")}
          </button>
        ) : (
          <div />
        )}
        <Button asChild size="sm" className="h-8 rounded-lg text-xs">
          <Link href={notification.pathname}>
            {t("GO_TO_PAGE")}
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
