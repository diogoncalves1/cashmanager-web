import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import CurrencyConverterContainer from "@/features/converter/components/containers/CurrencyConverterContainer";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CONVERTER");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function ConverterPage() {
  const t = useTranslations("CONVERTER");
  return (
    <>
      <PageBreadcrumb pageTitle={t("CONVERTER")} breadcrumb={[{ title: t("CONVERTER") }]} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <CurrencyConverterContainer />
      </div>
    </>
  );
}
