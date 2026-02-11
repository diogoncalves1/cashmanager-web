import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SettingsForm from "./components/SettingsForm";
import { useTranslations } from "next-intl";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cash Manager | Settings",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function SettingsPage() {
  const t = useTranslations("SETTINGS");
  return (
    <>
      <PageBreadcrumb pageTitle={t("SETTINGS")} breadcrumb={[{ title: t("SETTING") }]} />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Page header */}
          <SettingsForm />
        </div>
      </main>
    </>
  );
}
