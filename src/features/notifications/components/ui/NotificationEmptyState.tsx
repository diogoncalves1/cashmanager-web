import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { TabFilter } from "../../types";

export function EmptyState({ filter }: { filter: TabFilter }) {
  const t = useTranslations("NOTIFICATIONS");
  const messageKey = {
    all: "EMPTY_ALL",
    unread: "EMPTY_UNREAD",
  }[filter];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Bell className="size-7 text-gray-400" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">{t(messageKey)}</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">{t("EMPTY_DESCRIPTION")}</p>
    </div>
  );
}
