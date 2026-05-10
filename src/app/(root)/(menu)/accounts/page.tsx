import type { Metadata } from "next";

import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { AccountsContainer } from "@/features/accounts";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ACCOUNTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function AccountsPage() {
  const t = useTranslations("ACCOUNTS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("ACCOUNTS")} breadcrumb={[{ title: t("ACCOUNTS") }]} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <AccountsContainer />
      </div>
    </>
  );
}
