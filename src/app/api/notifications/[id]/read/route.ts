import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/features/notifications";
import { serverApiClient } from "@/shared/api/api-client.server";

type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const data = await serverApiClient.post<Notification>(`notifications/${id}/read`);
  return NextResponse.json(data);
}
