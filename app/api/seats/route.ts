import { NextResponse } from "next/server";
import { fetchFastAPI } from "@/lib/fastapi";

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("showId");
    if (!id) return NextResponse.json({ error: "showId required" }, { status: 400 });

    // Fetch dynamic seat map directly from FastAPI backend
    const seatMap = await fetchFastAPI(`/showtimes/${id}/seats`);
    return NextResponse.json(seatMap);
  } catch (err: any) {
    return NextResponse.json({ error: "Showtime seat-map not found in FastAPI" }, { status: 404 });
  }
}
