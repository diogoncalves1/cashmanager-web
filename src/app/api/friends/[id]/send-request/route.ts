import { serverApiClient } from "@/lib/api/api-client.server";
import { Friendship } from "@/types/friendship";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<Friendship>(`friendship-requests/${id}/send`);
  return NextResponse.json(data);
}
