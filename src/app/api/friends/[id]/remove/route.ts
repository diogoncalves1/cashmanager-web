import { serverApiClient } from "@/lib/api/api-client.server";
import { Friendship } from "@/types/friendship";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.delete<Friendship>(`friendships/${id}/remove`);
  return NextResponse.json(data);
}
