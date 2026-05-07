import { NextResponse } from "next/server";
import { SharedRole } from "@/types/sharedRole";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<SharedRole[]>(`shared-roles`);
  return NextResponse.json(data);
}
