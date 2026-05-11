import { NextResponse } from "next/server";
import { DebtBasic } from "@/features/debts";
import { serverApiClient } from "@/shared/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<DebtBasic[]>(`debts/all`);
  return NextResponse.json(data);
}
