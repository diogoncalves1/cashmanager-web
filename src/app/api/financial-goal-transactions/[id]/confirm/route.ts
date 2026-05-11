import { serverApiClient } from "@/shared/api/api-client.server";
import { FinancialGoalTransaction } from "@/features/financial-goal-transactions";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<FinancialGoalTransaction>(
    `financial-goal-transactions/${id}/confirm`
  );
  return NextResponse.json(data);
}
