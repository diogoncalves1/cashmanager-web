import { serverApiClient } from "@/shared/api/api-client.server";
import { Friendship } from "@/features/friends";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.delete<Friendship>(`friendships/${id}/remove`);
  return NextResponse.json(data);
}
