import { NextResponse } from "next/server";
import { AccountBasic } from "@/types/account";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<AccountBasic[]>(`accounts/all`);
  return NextResponse.json(data);
}
