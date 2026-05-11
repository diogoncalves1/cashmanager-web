import { NextResponse } from "next/server";
import { SharedRole } from "@/shared/types/sharedRole";
import { serverApiClient } from "@/shared/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<SharedRole[]>(`shared-roles`);
  return NextResponse.json(data);
}
