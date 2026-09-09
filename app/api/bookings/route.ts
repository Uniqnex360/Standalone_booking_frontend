import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { fetchFastAPI, getFastAPIToken } from "@/lib/fastapi";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Please login first" }, { status: 401 });

    const { showId, seatIds } = await req.json();
    if (!Array.isArray(seatIds) || !seatIds.length) {
      return NextResponse.json({ error: "Select at least one seat" }, { status: 400 });
    }

    const token = await getFastAPIToken();

    // Call FastAPI atomic booking endpoint
    const result = await fetchFastAPI("/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        showtime_id: showId,
        seat_ids: seatIds,
        idempotency_key: `pay-${userId}-${Date.now()}`,
      }),
    });

    return NextResponse.json({
      booking: {
        id: result.ref_code,
        refCode: result.ref_code,
        showId: showId,
        amount: result.total_price_cents / 100,
        status: result.status,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Booking failed" }, { status: 409 });
  }
}
