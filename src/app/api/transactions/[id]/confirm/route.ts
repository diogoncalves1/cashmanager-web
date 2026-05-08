import { serverApiClient } from "@/lib/api/api-client.server";
import { Transaction } from "@/features/transactions/types";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<Transaction>(`transactions/${id}/confirm`);
  return NextResponse.json(data);
}
