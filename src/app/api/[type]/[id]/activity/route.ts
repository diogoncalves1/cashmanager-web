import { NextRequest, NextResponse } from "next/server";
import { serverApiClient } from "@/shared/api/api-client.server";
import { ActivityType, ActivityTypeTypes } from "@/shared/types/activity";
import { isInviteType } from "@/features/invitations";

type Params = Promise<{
  id: string;
  type: ActivityType;
}>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id, type } = await params;

  if (!isInviteType(type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const url = new URL(req.url);

  const page = Number(url.searchParams.get("page") || 1);
  const length = Number(url.searchParams.get("size") || 10);

  const paramsURL = new URLSearchParams(url.search);
  paramsURL.set("start", ((page - 1) * length).toString());
  paramsURL.set("length", length.toString());

  const data = await serverApiClient.get<ActivityTypeTypes>(
    `${type}/${id}/activity?${paramsURL.toString()}`
  );

  return NextResponse.json({
    data: data.data,
    nextPage: (data.recordsTotal ?? 0) > page * length ? page + 1 : null,
  });
}
