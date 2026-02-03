import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import GoalTransactionDetails from "./components/GoalTransactionDetails";

type Props = {
  params: {
    id: string;
  };
};

export default function TransactionDetailPage({ params }: Props) {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  const { id } = params;

  return (
    <>
      {/* Breadcrumb */}
      <PageBreadcrumb
        pageTitle={t("ADD_TRANSACTION")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("TRANSACTIONS"), path: "/financial-goal-transactions" },
          { title: t("DETAILS") },
        ]}
      />

      <GoalTransactionDetails id={id} />
    </>
  );
}
