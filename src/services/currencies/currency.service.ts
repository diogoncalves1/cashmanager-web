import { Currency } from "@/models/currency";

interface ApiResponse<T> {
  data: T[];
  success: boolean;
}

export async function getCurrencies(): Promise<ApiResponse<Currency>> {
  const res = await fetch(`/api/currencies`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debts");

  const response = await res.json();
  return response;
}
