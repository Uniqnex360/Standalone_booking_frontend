import { NextResponse } from "next/server";
import { fetchFastAPI } from "@/lib/fastapi";

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("showId");
    if (!id) return NextResponse.json({ error: "showId required" }, { status: 400 });

    // Fetch dynamic seat map directly from FastAPI backend
    const seatMap = await fetchFastAPI(`/showtimes/${id}/seats`);

    // Translate nested rows [A-J] from FastAPI to flattened format for Next.js
    const seats: any[] = [];
    for (const row of seatMap.rows) {
      for (const seat of row.seats) {
        seats.push({
          id: seat.id,
          showId: id,
          seatNo: seat.code,
          status: seat.status === "BOOKED" ? "LOCKED" : "AVAILABLE",
          bookingId: null
        });
      }
    }

    return NextResponse.json({
      id: id,
      movieId: id,
      screenId: seatMap.screen_name,
      startsAt: seatMap.starts_at,
      price: seatMap.rows[0]?.price_cents ? (seatMap.rows[0].price_cents / 100) : 290,
      movie: {
        id: id,
        title: seatMap.movie_title,
        description: `Live screening at ${seatMap.cinema_name}.`,
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
        durationMin: 162,
        language: "Malayalam",
        certificate: "UA"
      },
      screen: {
        id: seatMap.screen_name,
        name: seatMap.screen_name,
        capacity: 234
      },
      seats: seats
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Showtime seat-map not found in FastAPI" }, { status: 404 });
  }
}
