import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import { ApiResponse, Stats } from "@/features/friends";

export async function onBlockUser(id: string, t: ReturnType<typeof useTranslations>) {
  const result = await Swal.fire({
    title: t("BLOCK_USER_MESSAGE"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t("YES_BLOCK"),
    cancelButtonText: t("CANCEL"),
  });
  if (result.isConfirmed) {
    LoadingToast({ title: t("BLOCKING_USER_TITLE"), message: t("BLOCKING_USER_MESSAGE") });
    try {
      const res = await fetch(`/api/friends/${id}/block`, {
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

export async function onRemoveFriend(id: string, t: ReturnType<typeof useTranslations>) {
  const result = await Swal.fire({
    title: t("REMOVE_FRIEND_MESSAGE"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t("YES_REMOVE"),
    cancelButtonText: t("CANCEL"),
  });
  if (result.isConfirmed) {
    LoadingToast({
      title: t("REMOVING_FRIEND_TITLE"),
      message: t("REMOVING_FRIEND_MESSAGE"),
    });
    try {
      const res = await fetch(`/api/friends/${id}/remove`, {
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
  return 0;
}

export async function onSendRequest(id: string, t: ReturnType<typeof useTranslations>) {
  LoadingToast({
    title: t("SENDING_FRIEND_REQUEST_TITLE"),
    message: t("SENDING_FRIEND_REQUEST_MESSAGE"),
  });
  try {
    const res = await fetch(`/api/friends/${id}/send-request`, {
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
  return 0;
}

export async function onUnblockUser(id: string, t: ReturnType<typeof useTranslations>) {
  const result = await Swal.fire({
    title: t("UNBLOCK_USER_MESSAGE"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t("YES_UNLBOCK"),
    cancelButtonText: t("CANCEL"),
  });
  if (result.isConfirmed) {
    LoadingToast({
      title: t("UNBLOCKING_USER_TITLE"),
      message: t("UNBLOCKING_USER_MESSAGE"),
    });
    try {
      const res = await fetch(`/api/friends/${id}/unblock`, {
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

export async function getFriendsStats(): Promise<ApiResponse<Stats>> {
  const res = await fetch(`/api/friends/stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch friend stats");

  const response = await res.json();
  return response;
}
