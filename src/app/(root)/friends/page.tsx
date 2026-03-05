import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SocialTabs from "./components/SocialTabs";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { FriendsProvider } from "./context/FriendsContext";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FRIENDS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function SocialPage() {
  const t = useTranslations("FRIENDS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("FRIENDS")} breadcrumb={[{ title: t("FRIENDS") }]} />
      <div className="space-y-8 max-w-6xl mx-auto px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">{t("FRIENDS")}</h1>
          <p className="mt-2 text-muted-foreground">{t("FRIENDS_TEXT")}</p>
        </div>

        <FriendsProvider>
          <SocialTabs />
        </FriendsProvider>
      </div>
    </>
  );
}
