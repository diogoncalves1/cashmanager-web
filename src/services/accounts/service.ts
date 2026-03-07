import { SwalToast } from "@/components/swal/SwalToast";
import Swal from "sweetalert2";

export async function onDeleteAccount(id: string, mutate?: () => void) {
  try {
    const res = await fetch(`/api/accounts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      return data;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, icon: "error" };
    } else {
      return { message: String(err), icon: "error" };
    }
  }
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
