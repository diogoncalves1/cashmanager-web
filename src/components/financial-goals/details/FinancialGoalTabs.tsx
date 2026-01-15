import { DetailsTabs } from "@/components/details/DetailsTab";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

type FinancialGoalTabsProps = {
  activeTab: "overview" | "transactions" | "users" | "others" | "monthly-summary";
  setActiveTab: Dispatch<
    SetStateAction<"overview" | "transactions" | "users" | "others" | "monthly-summary">
  >;
};

type Tab = {
  id: string;
  label: string;
};

export function FinancialGoalTabs({ activeTab, setActiveTab }: FinancialGoalTabsProps) {
  const t = useTranslations("FINANCIAL_GOALS");

  const tabs = [
    { id: "overview", label: t("OVERVIEW") },
    { id: "transactions", label: t("TRANSACTIONS") },
    { id: "users", label: t("USERS") },
    { id: "monthly-summary", label: t("MONTHLY_SUMMARY") },
    { id: "others", label: t("OTHERS") },
  ].filter((tab): tab is Tab => Boolean(tab));

  return (
    <DetailsTabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
    />
  );
}
