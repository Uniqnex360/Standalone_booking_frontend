import Link from "next/link";
import { fetchFastAPI } from "@/lib/fastapi";

export default async function Home() {
  let showtimes: any[] = [];
  try {
    showtimes = await fetchFastAPI("/showtimes");
  } catch (err) {
    console.error("Failed to connect to FastAPI backend:", err);
  }

  // Map FastAPI showtime into the movie structure expected by the page layout
  const firstShow = showtimes[0];
  const movies = firstShow
    ? [
        {
          id: firstShow.id,
          title: firstShow.movie_title,
          language: firstShow.language,
          certificate: firstShow.certificate,
          durationMin: firstShow.duration_min,
          description: `Now Showing at ${firstShow.cinema_name} • ${firstShow.screen_name}`,
          posterUrl:
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
        },
      ]
    : [];

  return (
    <main className="container">
      <h1>Movies at PVR Cinemas</h1>
      <p className="muted">Internal movie booking application (Connected to FastAPI)</p>
      
      {movies.length === 0 ? (
        <div style={{ padding: "20px", color: "#f87171" }}>
          No showtimes found. Make sure your FastAPI backend is running on port 8000!
        </div>
      ) : (
        <div className="grid">
          {movies.map((m) => (
            <article className="card" key={m.id}>
              <img className="poster" src={m.posterUrl} alt={m.title} />
              <div className="pad">
                <h2>{m.title}</h2>
                <p>
                  {m.language} · {m.certificate} · {m.durationMin} min
                </p>
                <p>{m.description}</p>
                <Link className="btn" href={`/movies/${m.id}`}>
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
