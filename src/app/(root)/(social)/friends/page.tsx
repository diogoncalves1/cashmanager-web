import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { FriendsProvider, SocialTabs } from "@/features/friends";
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
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">{t("FRIENDS")}</h1>
          <p className="mt-2 text-muted-foreground max-w-sm md:max-w-7xl">{t("FRIENDS_TEXT")}</p>
        </div>

        <FriendsProvider>
          <SocialTabs />
        </FriendsProvider>
      </div>
    </>
  );
}
