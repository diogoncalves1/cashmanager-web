import { useAuth } from "@/features/auth";
import React from "react";
import { Notification } from "../../types";
import { cn, timeAgo } from "@/shared/utils";
import { NotificationAvatar } from "../ui/NotificationAvatar";
import { Clock } from "lucide-react";

function NotificationListItem({
  notification,
  isSelected,
  onClick,
  user,
}: {
  notification: Notification;
  isSelected: boolean;
  onClick: () => void;
  user: ReturnType<typeof useAuth>["user"];
}) {
  const isUnread = !notification.readAt;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors",
        isSelected
          ? "bg-violet-50 dark:bg-violet-900/20"
          : isUnread
            ? "bg-amber-50/60 hover:bg-amber-50 dark:bg-amber-900/10 dark:hover:bg-amber-900/20"
            : "hover:bg-gray-50 dark:hover:bg-white/5"
      )}
    >
      <NotificationAvatar title={notification.title} size="md" />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm text-gray-800 dark:text-gray-100",
            isUnread && "font-medium"
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          {notification.message}
        </p>
        <span className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600">
          <Clock className="size-3" />
          {timeAgo(user, notification.createdAt)}
        </span>
      </div>

      {isUnread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-400" />}
    </button>
  );
}

export default NotificationListItem;
