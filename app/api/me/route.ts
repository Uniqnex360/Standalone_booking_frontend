import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth";
import { fetchFastAPI } from "@/lib/fastapi";

export async function GET() {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json(null);

    const user = await fetchFastAPI("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.email.split("@")[0],
      email: user.email,
    });
  } catch {
    return NextResponse.json(null);
  }
}