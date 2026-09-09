import { NextResponse } from "next/server";
import { fetchFastAPI } from "@/lib/fastapi";

export async function GET() {
  try {
    // 1. Fetch live showtimes from your FastAPI backend
    const showtimes = await fetchFastAPI("/showtimes");

    // 2. Shape showtimes into the structure expected by the senior's movie grid
    const moviesMap: Record<string, any> = {};

    for (const st of showtimes) {
      const mTitle = st.movie_title;
      if (!moviesMap[mTitle]) {
        moviesMap[mTitle] = {
          id: st.id, // Using first showtime ID as a placeholder Movie ID
          title: mTitle,
          description: `High-definition cinematic screening at ${st.cinema_name}.`,
          posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
          durationMin: st.duration_min,
          language: st.language,
          certificate: st.certificate,
          shows: []
        };
      }

      moviesMap[mTitle].shows.push({
        id: st.id,
        movieId: moviesMap[mTitle].id,
        screenId: st.screen_name,
        startsAt: st.starts_at,
        price: 290, // Rupees conversion for UI display
        screen: {
          id: st.screen_name,
          name: st.screen_name,
          capacity: 234
        }
      });
    }

    return NextResponse.json(Object.values(moviesMap));
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch from FastAPI: " + err.message }, { status: 500 });
  }
}
