import { serverApiClient } from "@/shared/api/api-client.server";
import { FinancialGoal } from "@/features/financial-goals";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<FinancialGoal>(`financial-goals/${id}/complete`);
  return NextResponse.json(data);
}
