import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import InvitationContainer from "./components/InvitationContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cash Manager | Debts",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function InvitationsPage() {
  const t = useTranslations("DEBTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBT")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("INVITES") }]}
      />

      <InvitationContainer />
    </>
  );
}
