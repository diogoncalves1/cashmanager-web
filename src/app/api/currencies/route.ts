import { NextResponse } from "next/server";
import { Currency } from "@/types/currency";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function GET() {
  const data = await serverApiClient.get<Currency[]>(`currencies`);
  return NextResponse.json(data);
}
