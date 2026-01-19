import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SocialTabs from "@/components/social/SocialTabs";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Cash Manager | Amizades",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function SocialPage() {
  const t = useTranslations("FRIENDS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("FRIEND")} breadcrumb={[{ title: t("FRIENDS") }]} />
      <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <SocialTabs />
        </div>
      </div>
    </>
  );
}
