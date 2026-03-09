import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";

export async function onDeleteDebt(id: string) {
  try {
    const res = await fetch(`/api/debts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: false };
    }
    return { message: String(err), success: false };
  }
}

export async function onResetDebt(id: string, t: ReturnType<typeof useTranslations>) {
  const result = await Swal.fire({
    title: t("RESET_FINANCIAL_GOAL_MESSAGE"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t("YES_RESET"),
    cancelButtonText: t("CANCEL"),
  });
  if (result.isConfirmed) {
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
  return 0;
}

export async function onMarkPaidDebt(
  id: string,
  t: ReturnType<typeof useTranslations>,
  mutate?: () => void
) {
  const result = await Swal.fire({
    title: t("MARK_DEBT_PAID"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t("YES_MARK"),
    cancelButtonText: t("CANCEL"),
  });
  if (result.isConfirmed) {
    LoadingToast({ title: t("MARKING_TITLE"), message: t("MARKING_MESSAGE") });
    try {
      const res = await fetch(`/api/debts/${id}/mark-paid`, {
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
  return 0;
}
