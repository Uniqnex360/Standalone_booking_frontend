import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { fetchFastAPI } from "@/lib/fastapi";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Register on FastAPI backend
    const result = await fetchFastAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const user = result.user;
    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: name || user.email.split("@")[0],
        email: user.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 400 }
    );
  }
}
