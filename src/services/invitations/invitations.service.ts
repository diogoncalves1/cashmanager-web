import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import { useTranslations } from "next-intl";

type InviteType = "debts" | "financial-goals" | "accounts";

export async function onCancelInvite(
  id: string,
  userId: string,
  type: InviteType,
  t: ReturnType<typeof useTranslations>,
  mutate?: () => void
) {
  const loadingT = LoadingToast({ title: t("CANCELING_TITLE"), message: t("CANCELING_MESSAGE") });

  try {
    const res = await fetch(`/api/${type}/${id}/invite/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();
    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: false };
    }
    return { message: String(err), success: false };
  } finally {
    loadingT.close();
  }
}

export async function onAcceptInvite(id: string, type: InviteType, mutate?: () => void) {
  LoadingToast({ title: "A aceitar...", message: "A aceitar convite..." });
  try {
    const res = await fetch(`/api/${type}/${id}/accept`, {
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

export async function onRevokeInvite(id: string, type: InviteType, mutate?: () => void) {
  LoadingToast({ title: "A rejeitar...", message: "A rejeitar convite..." });
  try {
    const res = await fetch(`/api/${type}/${id}/revoke`, {
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

export async function onRemoveMember(
  id: string,
  type: InviteType,
  userId: string,
  mutate?: () => void
) {
  try {
    const res = await fetch(`/api/${type}/${id}/revoke-user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      return { message: data.message, success: true };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: true };
    }
    return { message: String(err), success: true };
  }
}

export async function onLeaveSuject(id: string, type: InviteType, mutate?: () => void) {
  try {
    const res = await fetch(`/api/${type}/${id}/leave`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, icon: true };
    }
    return { message: String(err), icon: true };
  }
}
