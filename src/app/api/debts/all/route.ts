import { NextResponse } from "next/server";
import { DebtBasic } from "@/types/debt";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<DebtBasic[]>(`debts/all`);
  return NextResponse.json(data);
}
