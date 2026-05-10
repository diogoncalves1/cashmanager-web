import { serverApiClient } from "@/shared/api/api-client.server";
import { FriendRequest } from "@/features/friends";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<FriendRequest>(`friendship-requests/${id}/accept`);
  return NextResponse.json(data);
}
