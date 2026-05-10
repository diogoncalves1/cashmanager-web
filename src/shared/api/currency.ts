import { ResponseData } from "@/shared/api/api-client";
import { Currency } from "@/shared/types/currency";

export async function getCurrencies(): Promise<ResponseData<Currency[]>> {
  const res = await fetch(`/api/currencies`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debts");

  const response = await res.json();
  return response;
}
