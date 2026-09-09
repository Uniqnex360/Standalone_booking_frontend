import { NextResponse } from "next/server";
import { getSessionToken, clearSession } from "@/lib/auth";
import { fetchFastAPI } from "@/lib/fastapi";

export async function GET() {
  try {
    const token = await getSessionToken();
    if (!token) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const bookings = await fetchFastAPI("/bookings/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(bookings);
  } catch (e: any) {
    if (e.message?.includes("User not found") || e.message?.includes("401") || e.message?.includes("404")) {
      await clearSession();
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message || "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await getSessionToken();
    if (!token) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { showId, seatIds } = await req.json();
    if (!Array.isArray(seatIds) || !seatIds.length) {
      return NextResponse.json({ error: "Select at least one seat" }, { status: 400 });
    }

    const result = await fetchFastAPI("/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        showtime_id: showId,
        seat_ids: seatIds,
        idempotency_key: `pay-${Date.now()}`,
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
    if (e.message?.includes("User not found") || e.message?.includes("401") || e.message?.includes("404")) {
      await clearSession();
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message || "Booking failed" }, { status: 409 });
  }
}
