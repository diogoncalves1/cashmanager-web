import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import InvitationContainer from "@/components/invitations/InvitationContainer";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ACCOUNTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}
export default function InvitationsPage() {
  const t = useTranslations("ACCOUNTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("ACCOUNTS")}
        breadcrumb={[{ title: t("ACCOUNTS"), path: "/accounts" }, { title: t("INVITES") }]}
      />

      <InvitationContainer type="accounts" />
    </>
  );
}
