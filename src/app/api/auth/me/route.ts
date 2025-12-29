import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return Response.json({ user: null });

  return Response.json({ token });
}
