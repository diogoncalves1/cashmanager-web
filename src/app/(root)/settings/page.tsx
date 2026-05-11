import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import SettingsForm from "./components/SettingsForm";
import { useTranslations } from "next-intl";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SETTINGS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function SettingsPage() {
  const t = useTranslations("SETTINGS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("SETTINGS")} breadcrumb={[{ title: t("SETTINGS") }]} />

      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Page header */}
          <SettingsForm />
        </div>
      </main>
    </>
  );
}
