import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { fetchFastAPI } from "@/lib/fastapi";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Authenticate against FastAPI backend
    const result = await fetchFastAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const user = result.user;
      await createSession(result.token);


    return NextResponse.json({
      user: {
        id: user.id,
        name: user.email.split("@")[0],
        email: user.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }
}
