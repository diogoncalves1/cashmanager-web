import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SocialTabs from "./components/SocialTabs";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { FriendsProvider } from "./context/FriendsContext";

export const metadata: Metadata = {
  title: "Cash Manager | Amizades",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function SocialPage() {
  const t = useTranslations("FRIENDS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("FRIEND")} breadcrumb={[{ title: t("FRIENDS") }]} />
      <div className="space-y-8 max-w-6xl mx-auto px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Friends</h1>
          <p className="mt-2 text-muted-foreground">Manage your connections and friend requests.</p>
        </div>

        <FriendsProvider>
          <SocialTabs />
        </FriendsProvider>
      </div>
    </>
  );
}
