import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import InvitationContainer from "./components/InvitationContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cash Manager | Accounts",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function InvitationsPage() {
  const t = useTranslations("ACCOUNTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("ACCOUNTS")}
        breadcrumb={[{ title: t("ACCOUNTS"), path: "/accounts" }, { title: t("INVITES") }]}
      />

      <InvitationContainer />
    </>
  );
}
