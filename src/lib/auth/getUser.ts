import { cookies } from "next/headers";
import { User } from "../models/user";

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) throw new Error("API_URL não definida");

    const res = await fetch(`${process.env.API_BACKEND_URL}me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const data = await res.json();

    const user = data.data;

    return user;
  } catch (err) {
    return null;
  }
}
