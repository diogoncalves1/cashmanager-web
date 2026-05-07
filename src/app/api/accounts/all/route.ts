import { NextResponse } from "next/server";
import { AccountBasic } from "@/features/accounts/types/index";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<AccountBasic[]>(`accounts/all`);
  return NextResponse.json(data);
}
