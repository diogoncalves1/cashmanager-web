import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InvitationContainer from "@/components/invitations/InvitationContainer";
import { InvitationType } from "@/types/invitation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    type: InvitationType;
  }>;
};

const invitationConfig = {
  accounts: {
    namespace: "ACCOUNTS",
    titleKey: "ACCOUNTS",
    path: "/accounts",
    invitationType: "accounts",
  },
  debts: {
    namespace: "DEBTS",
    titleKey: "DEBTS",
    path: "/debts",
    invitationType: "debts",
  },
  "financial-goals": {
    namespace: "FINANCIAL_GOALS",
    titleKey: "FINANCIAL_GOALS",
    path: "/financial-goals",
    invitationType: "financial-goals",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;

  const config = invitationConfig[type as keyof typeof invitationConfig];

  if (!config) {
    return {
      title: "Not Found",
    };
  }

  const t = await getTranslations(config.namespace);

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default async function InvitationsPage({ params }: Props) {
  const { type } = await params;

  const config = invitationConfig[type as keyof typeof invitationConfig];

  if (!config) {
    return <div>Invalid invitation type</div>;
  }

  const t = await getTranslations(config.namespace);

  return (
    <>
      <PageBreadcrumb
        pageTitle={t(config.titleKey)}
        breadcrumb={[
          {
            title: t(config.titleKey),
            path: config.path,
          },
          {
            title: t("INVITES"),
          },
        ]}
      />

      <InvitationContainer type={config.invitationType} />
    </>
  );
}
