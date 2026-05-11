import { NextResponse } from "next/server";
import { Currency } from "@/shared/types/currency";
import { serverApiClient } from "@/shared/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<Currency[]>(`currencies`);
  return NextResponse.json(data);
}
