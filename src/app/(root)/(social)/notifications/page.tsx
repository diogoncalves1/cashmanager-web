import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { NotificationContainer } from "@/features/notifications";

export default function NotificationsPage() {
  const t = useTranslations("NOTIFICATIONS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("NOTIFICATIONS")} breadcrumb={[{ title: t("NOTIFICATIONS") }]} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <NotificationContainer />
      </div>
    </>
  );
}
