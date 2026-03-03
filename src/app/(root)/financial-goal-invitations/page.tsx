import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";

import { Metadata } from "next";
import InvitationContainer from "@/components/invitations/InvitationContainer";

export const metadata: Metadata = {
  title: "Cash Manager | Financial Goals",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function InvitationsPage() {
  const t = useTranslations("FINANCIAL_GOALS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOALS")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("INVITES") },
        ]}
      />

      <InvitationContainer type="financial-goals" />
    </>
  );
}
