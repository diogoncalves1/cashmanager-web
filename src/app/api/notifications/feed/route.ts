import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/features/notifications";
import { serverApiClient } from "@/shared/api/api-client.server";
import { buildUrl } from "@/shared/utils";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const page = Number(url.searchParams.get("page") || 0);
  const length = Number(url.searchParams.get("limit") || 20);
  const start = page * length;

  const params = {
    start: start.toString(),
    length: length.toString(),
  };

  const fetchUrl = page == 0 ? `notifications/feed` : buildUrl("notifications", params);

  const data = await serverApiClient.get<Notification[]>(fetchUrl);

  return NextResponse.json({
    page,
    length,
    recordsTotal: data.recordsTotal,
    recordsFiltered: data.recordsFiltered,
    data: data.data,
    url,
    params,
  });
}
