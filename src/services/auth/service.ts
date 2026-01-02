import LoadingToast from "@/components/swal/LoadingToast";

export async function onLogout(t: (key: string) => string) {
  try {
    const toastRef = LoadingToast({ title: t("LOGOUT"), message: t("LOGOUT_WAIT") });

    const res = await fetch(`/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    toastRef.close();
    return 1;
  } catch (err: any) {
    return 0;
  }
}
