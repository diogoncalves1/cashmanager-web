import { serverApiClient } from "@/shared/api/api-client.server";
import { DebtPayment } from "@/features/debt-payments";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<DebtPayment>(`debt-payments/${id}/confirm`);
  return NextResponse.json(data);
}
