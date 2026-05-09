import { NextRequest, NextResponse } from "next/server";
import { DebtPayment } from "@/features/debt-payments/types/index";
import { serverApiClient } from "@/lib/api/api-client.server";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.get<DebtPayment>(`debt-payments/${id}`);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await req.json();
  const data = await serverApiClient.put<DebtPayment>(`debt-payments/${id}`, body);
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.delete<DebtPayment>(`debt-payments/${id}`);
  return NextResponse.json(data);
}
