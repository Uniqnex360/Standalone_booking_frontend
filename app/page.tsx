import Link from "next/link";
import { fetchFastAPI } from "@/lib/fastapi";

export const dynamic = "force-dynamic";

export default async function Home() {
  let showtimes: any[] = [];
  try {
    showtimes = await fetchFastAPI("/showtimes");
  } catch (err) {
    console.error("Failed to connect to FastAPI backend:", err);
  }

  // Group all distinct movies from showtimes
  const moviesMap: Record<string, any> = {};
  for (const st of showtimes) {
    if (!moviesMap[st.movie_title]) {
      moviesMap[st.movie_title] = {
        id: st.id,
        title: st.movie_title,
        language: st.language,
        certificate: st.certificate,
        durationMin: st.duration_min,
        cinema: st.cinema_name,
        screen: st.screen_name,
        description: `Now Showing on ${st.screen_name} at ${st.cinema_name}.`,
        posterUrl:
          st.movie_title === "I Am Game"
            ? "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60"
            : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
      };
    }
  }

  const movies = Object.values(moviesMap);

  return (
    <main className="container">
      <h1>Movies at {movies[0]?.cinema || "PVR Lulu Mall, Kochi"}</h1>
      <p className="muted">Select a movie below to book your tickets</p>

      {movies.length === 0 ? (
        <div style={{ padding: "20px", color: "#f87171" }}>
          No movies found. Please make sure your FastAPI backend is running on port 8000!
        </div>
      ) : (
        <div className="grid">
          {movies.map((m) => (
            <article className="card" key={m.id}>
              <img
                className="poster"
                src={m.posterUrl}
                alt={m.title}
                style={{ height: "280px", objectFit: "cover" }}
              />
              <div className="pad">
                <h2>{m.title}</h2>
                <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
                  {m.language} · {m.certificate} · {m.durationMin} mins
                </p>
                <p style={{ minHeight: "50px", fontSize: "14px" }}>{m.description}</p>
                <Link
                  className="btn"
                  href={`/movies/${m.id}`}
                  style={{ display: "block", textAlign: "center", marginTop: "12px" }}
                >
                  Book Tickets
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
