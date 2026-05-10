import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ChangePassword } from "@/features/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CHANGE_PASSWORD");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function ChangePasswordPage() {
  const t = useTranslations("CHANGE_PASSWORD");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("SETTINGS")}
        breadcrumb={[{ title: t("SETTINGS"), path: "/settings" }, { title: t("CHANGE_PASSWORD") }]}
      />
      <div className="mx-auto max-w-lg py-30  min-h-[80dvh] space-y-6">
        <ChangePassword />
      </div>
    </>
  );
}
