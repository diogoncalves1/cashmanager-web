export const fetcher = async ([url, options]: [string, RequestInit]) => {
  try {
    const res = await fetch(`/api${url}`, {
      ...options,
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro no fetch SWR");
    }

    return res.json();
  } catch (err: any) {
    console.error("Fetcher error:", err);
    throw err;
  }
};
