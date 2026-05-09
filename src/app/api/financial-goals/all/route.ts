import { NextResponse } from "next/server";
import { serverApiClient } from "@/lib/api/api-client.server";
import { FinancialGoalBasic } from "@/features/financial-goals/types";

export async function GET() {
  const data = await serverApiClient.get<FinancialGoalBasic[]>(`financial-goals/all`);
  return NextResponse.json(data);
}
