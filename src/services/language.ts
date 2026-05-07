import { ResponseData } from "@/lib/api/api-client";
import { Language } from "@/types/language";

export async function getLanguages(): Promise<ResponseData<Language[]>> {
  const res = await fetch(`/api/languages`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();
  return response;
}
