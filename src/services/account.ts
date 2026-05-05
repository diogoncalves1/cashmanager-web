import { SwalToast } from "@/components/swal/SwalToast";
import Swal from "sweetalert2";
import { AccountBasic } from "@/types/account";

export async function onDeleteAccount(
  id: string,
  mutate?: () => void
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/accounts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) mutate();

  return data;
}
export async function onChangeStatus(id: string, status: boolean) {
  const result = await Swal.fire({
    title: `${status ? "Desativar" : "Ativar"} conta?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Sim, ${status ? "desativar" : "ativar"}!`,
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    try {
      const res = await fetch(`/api/accounts/${id}/status`, {
        method: "PATCH",
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

interface ApiResponse<T> {
  data: T;
}

export async function getAllAccounts(): Promise<ApiResponse<AccountBasic[]>> {
  const res = await fetch(`/api/accounts/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goals");

  const response = await res.json();
  return response;
}

type Summary = {
  sentInvites: number;
  receivedInvites: number;
  pendingInvites: number;
  awaitingInvites: number;
};

interface ApiResponseInvitationStats {
  data: Summary;
  success: number;
  message: number;
}

export async function getInvitationStats(): Promise<ApiResponseInvitationStats> {
  const res = await fetch(`/api/accounts/invitations-stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch accounts stats");

  const response = await res.json();
  return response;
}
