import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import { useTranslations } from "next-intl";
import { FinancialGoalBasic } from "@/types/financialGoal";
import { ResponseData } from "@/lib/api/api-client";

interface TableInstance {
  reload: () => void;
  clear: () => void;
  getRowCount: () => number;
}
type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export async function onDeleteFinancialGoal(
  id: string,
  table?: TableInstance,
  pagination?: PaginationState,
  mutate?: () => void
) {
  const res = await fetch(`/api/financial-goals/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) await mutate();

  if (data.success) {
    if (table) {
      if (table.getRowCount() == 0 && pagination) pagination.pageIndex--;
    }
  }

  return data;
}

export async function onCancelFinancialGoal(
  id: string,
  t: ReturnType<typeof useTranslations>,
  mutate?: () => void
) {
  LoadingToast({
    title: t("CANCELED_FINANCIAL_GOAL_TITLE"),
    message: t("CANCELED_FINANCIAL_GOAL_MESSAGE"),
  });
  try {
    const res = await fetch(`/api/financial-goals/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      SwalToast({ message: data.message, icon: "success" });
      return 1;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      SwalToast({ message: err.message, icon: "error" });
    } else {
      SwalToast({ message: String(err), icon: "error" });
    }
    return 0;
  }
}

export async function onResetFinancialGoal(
  id: string,
  t: ReturnType<typeof useTranslations>,
  mutate?: () => void
) {
  LoadingToast({
    title: t("RESETED_FINANCIAL_GOAL_TITLE"),
    message: t("RESETED_FINANCIAL_GOAL_MESSAGE"),
  });
  try {
    const res = await fetch(`/api/financial-goals/${id}/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      SwalToast({ message: data.message, icon: "success" });
      return 1;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      SwalToast({ message: err.message, icon: "error" });
    } else {
      SwalToast({ message: String(err), icon: "error" });
    }
    return 0;
  }
}

export async function onMarkPaidFinancialGoal(
  id: string,
  t: ReturnType<typeof useTranslations>,
  mutate?: () => void
) {
  LoadingToast({ title: "A completar...", message: "A completar a sua meta financeira..." });
  try {
    const res = await fetch(`/api/financial-goals/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      SwalToast({ message: data.message, icon: "success" });
      return 1;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      SwalToast({ message: err.message, icon: "error" });
    } else {
      SwalToast({ message: String(err), icon: "error" });
    }
    return 0;
  }
}

export async function getAllFinancialGoals(): Promise<ResponseData<FinancialGoalBasic[]>> {
  const res = await fetch(`/api/financial-goals/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();

  return response;
}
