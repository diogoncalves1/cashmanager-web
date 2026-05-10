import { ResponseData } from "@/lib/api/api-client";
import { Currency } from "@/types/currency";

export async function getCurrencies(): Promise<ResponseData<Currency[]>> {
  const res = await fetch(`/api/currencies`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debts");

  const response = await res.json();
  return response;
}
