import { NextResponse } from "next/server";
import { serverApiClient } from "@/shared/api/api-client.server";
import { FinancialGoalBasic } from "@/features/financial-goals";

export async function GET() {
  const data = await serverApiClient.get<FinancialGoalBasic[]>(`financial-goals/all`);
  return NextResponse.json(data);
}
