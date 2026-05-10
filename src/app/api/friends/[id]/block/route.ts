import { serverApiClient } from "@/lib/api/api-client.server";
import { Friendship } from "@/features/friends";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<Friendship>(`friendships/${id}/block`);
  return NextResponse.json(data);
}
