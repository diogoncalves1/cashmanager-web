import { NextResponse } from "next/server";
import { serverApiClient } from "@/lib/api/api-client.server";
import { Friendship } from "@/features/friends";

export async function GET() {
  const data = await serverApiClient.get<Friendship>("friendships/stats");
  return NextResponse.json(data);
}
