import { NextRequest, NextResponse } from "next/server";
import { serverApiClient } from "@/shared/api/api-client.server";
import { Invitation, InvitationType, isInviteType } from "@/features/invitations";

type Params = Promise<{
  id: string;
  type: InvitationType;
}>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id, type } = await params;

  if (!isInviteType(type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const data = await serverApiClient.post<Invitation>(`${type}/${id}/revoke`);

  return NextResponse.json(data);
}
