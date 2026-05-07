import { isInviteType } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { serverApiClient } from "@/lib/api/api-client.server";
import { Invitation, InvitationType } from "@/types/invitation";

type Params = Promise<{
  id: string;
  type: InvitationType;
}>;

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id, type } = await params;

  if (!isInviteType(type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const data = await serverApiClient.delete<Invitation>(`${type}/${id}/leave`);

  return NextResponse.json(data);
}
