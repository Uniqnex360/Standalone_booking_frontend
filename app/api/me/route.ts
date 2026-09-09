import { NextResponse } from "next/server";
import { getSessionToken, clearSession } from "@/lib/auth";
import { fetchFastAPI } from "@/lib/fastapi";

export async function GET() {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ user: null });

    // Fetch user profile from FastAPI using the session token
    const user = await fetchFastAPI("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.email.split("@")[0],
        email: user.email,
      },
    });
  } catch (err: any) {
    // If token is invalid or user was deleted from DB, clear the cookie
    await clearSession();
    return NextResponse.json({ user: null });
  }
}
