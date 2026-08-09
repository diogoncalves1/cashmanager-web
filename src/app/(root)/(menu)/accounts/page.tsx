import type { Metadata } from "next";

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
  return <AccountsContainer />;
}
