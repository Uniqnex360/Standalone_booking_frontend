import { NextResponse } from "next/server";
import { fetchFastAPI } from "@/lib/fastapi";

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("movieId");
    if (!id) return NextResponse.json({ error: "movieId required" }, { status: 400 });

    const showtimes = await fetchFastAPI("/showtimes");
    
    // Group and return matching show slots
    const matched = showtimes.map((st: any) => ({
      id: st.id,
      movieId: id,
      screenId: st.screen_name,
      startsAt: st.starts_at,
      price: 290,
      movie: {
        id: id,
        title: st.movie_title,
        description: `Live screening at ${st.cinema_name}.`,
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
        durationMin: st.duration_min,
        language: st.language,
        certificate: st.certificate
      },
      screen: {
        id: st.screen_name,
        name: st.screen_name,
        capacity: 234
      }
    }));

    return NextResponse.json(matched);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
