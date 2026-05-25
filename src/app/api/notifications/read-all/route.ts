import { NextResponse } from "next/server";
import { Notification } from "@/features/notifications";
import { serverApiClient } from "@/shared/api/api-client.server";

export async function POST() {
  const data = await serverApiClient.post<Notification[]>(`notifications/read-all`);
  return NextResponse.json(data);
}
