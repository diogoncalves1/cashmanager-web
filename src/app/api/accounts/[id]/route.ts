import { NextRequest, NextResponse } from "next/server";
import { serverApiClient } from "@/shared/api/api-client.server";
import { Account } from "@/features/accounts/types";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.get<Account>(`accounts/${id}`);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await req.json();
  const data = await serverApiClient.put<Account>(`accounts/${id}`, body);
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.delete<Account>(`accounts/${id}`);
  return NextResponse.json(data);
}
