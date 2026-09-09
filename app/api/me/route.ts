import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json(null);

    return NextResponse.json({
      id: userId,
      name: "Customer",
      email: "demo@pvr.local",
    });
  } catch {
    return NextResponse.json(null);
  }
}
