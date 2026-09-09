import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth";
import { fetchFastAPI } from "@/lib/fastapi";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getSessionToken();
    if (!token) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const result = await fetchFastAPI(`/bookings/${id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to cancel booking" },
      { status: 400 }
    );
  }
}
