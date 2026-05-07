import { NextRequest, NextResponse } from "next/server";
import { serverApiClient } from "@/lib/api/api-client.server";
import { Invitation } from "@/types/invitation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const type = body.type;
  const userId = body.user_id;
  const id = body.id || body.subject_id;
  const data = await serverApiClient.post<Invitation>(`${type}/${id}/invite/${userId}`, body);
  return NextResponse.json(data);
}
