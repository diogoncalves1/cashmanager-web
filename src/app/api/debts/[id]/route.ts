import { NextRequest, NextResponse } from "next/server";
import { serverApiClient } from "@/lib/api/api-client.server";
import { Debt } from "@/types/debt";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.get<Debt>(`debts/${id}`);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await req.json();
  const data = await serverApiClient.put<Debt>(`debts/${id}`, body);
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.delete<Debt>(`debts/${id}`);
  return NextResponse.json(data);
}
