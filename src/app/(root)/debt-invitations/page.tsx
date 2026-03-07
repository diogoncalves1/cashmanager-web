import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import InvitationContainer from "@/components/invitations/InvitationContainer";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function InvitationsPage() {
  const t = useTranslations("DEBTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBT")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("INVITES") }]}
      />

      <InvitationContainer type="debts" />
    </>
  );
}
