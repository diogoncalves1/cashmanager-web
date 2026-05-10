import { NextRequest, NextResponse } from "next/server";
import { serverApiClient } from "@/shared/api/api-client.server";
import { FriendRequest } from "@/features/friends";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const page = Number(url.searchParams.get("page") || 1);
  const length = Number(url.searchParams.get("size") || 10);

  const params = new URLSearchParams(url.search);
  params.set("start", ((page - 1) * length).toString());
  params.set("length", length.toString());
  params.set("search[value]", url.searchParams.get("search") || "");

  const data = await serverApiClient.get<FriendRequest>(
    `friendship-requests/sent?${params.toString()}`
  );
  return NextResponse.json({
    data: data.data,
    nextPage: (data.recordsTotal ?? 0) > page * length ? page + 1 : null,
  });
}
