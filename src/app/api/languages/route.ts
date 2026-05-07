import { NextResponse } from "next/server";
import { Language } from "@/types/language";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<Language[]>(`languages`);
  return NextResponse.json(data);
}
