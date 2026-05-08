import { serverApiClient } from "@/lib/api/api-client.server";
import { Debt } from "@/features/debts/types";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<Debt>(`debts/${id}/mark-paid`);
  return NextResponse.json(data);
}
