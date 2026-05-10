import { NextResponse } from "next/server";
import { Language } from "@/shared/types/language";
import { serverApiClient } from "@/shared/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<Language[]>(`languages`);
  return NextResponse.json(data);
}
