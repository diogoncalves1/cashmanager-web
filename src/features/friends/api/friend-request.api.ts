import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import { useTranslations } from "next-intl";

export async function onAcceptRequest(id: string, t: ReturnType<typeof useTranslations>) {
  LoadingToast({ title: t("ACCEPT_REQUEST_TITLE"), message: t("ACCEPT_REQUEST_MESSAGE") });
  try {
    const res = await fetch(`/api/friend-requests/${id}/accept`, {
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

export async function onDeclineRequest(id: string, t: ReturnType<typeof useTranslations>) {
  LoadingToast({
    title: t("DECLINING_REQUEST_TITLE"),
    message: t("DECLINING_REQUEST_MESSAGE"),
  });
  try {
    const res = await fetch(`/api/friend-requests/${id}/decline`, {
      method: "DELETE",
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

export async function onCancelRequest(id: string, t: ReturnType<typeof useTranslations>) {
  LoadingToast({
    title: t("CANCELING_REQUEST_TITLE"),
    message: t("CANCELING_REQUEST_MESSAGE"),
  });
  try {
    const res = await fetch(`/api/friend-requests/${id}/cancel`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch requests");

    const data = await res.json();

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
