import { AccountDetailsContainer } from "@/features/accounts";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { AccountDetailsProvider } from "@/features/accounts";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface AccountDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ACCOUNTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default async function AccountDetailsPage({ params }: AccountDetailsProps) {
  const { id } = await params;
  const t = await getTranslations("ACCOUNTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("ACCOUNTS")}
        breadcrumb={[{ title: t("ACCOUNTS"), path: "/accounts" }, { title: t("DETAILS") }]}
      />
      <AccountDetailsProvider>
        <AccountDetailsContainer id={id} />
      </AccountDetailsProvider>
    </>
  );
}
