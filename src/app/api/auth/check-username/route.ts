import { NextResponse, NextRequest } from "next/server";
import { clientApiClient } from "@/lib/api/api-client.client";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const username = url.searchParams.get("username");

  const res = await clientApiClient.get(`check-username?username=${username}`);

  return NextResponse.json(res);
}
