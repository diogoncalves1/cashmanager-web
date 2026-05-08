import { NextResponse } from "next/server";
import { DebtBasic } from "@/features/debts/types";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<DebtBasic[]>(`debts/all`);
  return NextResponse.json(data);
}
