import { serverApiClient } from "@/lib/api/api-client.server";
import { FriendRequest } from "@/types/friendship";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.delete<FriendRequest>(`friendship-requests/${id}/decline`);
  return NextResponse.json(data);
}
