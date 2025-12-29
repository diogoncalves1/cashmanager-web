import { NextResponse, NextRequest } from "next/server";

const users = [
  { id: 1, username: "johndoe", password: "1234", email: "john@example.com" },
  { id: 2, username: "janedoe", password: "abcd", email: "jane@example.com" },
];

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const res = await fetch("http://127.0.0.1:8000/api/v1/currencies", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
