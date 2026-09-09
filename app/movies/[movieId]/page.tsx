import Link from "next/link";
import { fetchFastAPI } from "@/lib/fastapi";

export const dynamic = "force-dynamic";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;

  let showtimes: any[] = [];
  try {
    showtimes = await fetchFastAPI("/showtimes");
  } catch (err) {
    console.error("Failed to fetch showtimes:", err);
  }

  const selectedShow = showtimes.find((s) => s.id === movieId);
  if (!selectedShow) {
    return (
      <main className="container" style={{ textAlign: "center", padding: "40px" }}>
        <h1>Movie not found</h1>
        <Link href="/" className="btn" style={{ marginTop: "16px", display: "inline-block" }}>
          ← Back to Movies
        </Link>
      </main>
    );
  }

  // Filter showtimes for this specific movie title
  const movieShowtimes = showtimes.filter(
    (s) => s.movie_title === selectedShow.movie_title
  );

  const movie = {
    title: selectedShow.movie_title,
    language: selectedShow.language,
    certificate: selectedShow.certificate,
    durationMin: selectedShow.duration_min,
    cinema: selectedShow.cinema_name,
    posterUrl:
      selectedShow.movie_title === "I Am Game"
        ? "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60"
        : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
    shows: movieShowtimes.map((s) => ({
      id: s.id,
      startsAt: s.starts_at,
      price: 290,
      screen: {
        name: s.screen_name,
      },
    })),
  };

  return (
    <main className="container">
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/"
          style={{ textDecoration: "none", color: "#f59e0b", fontWeight: "bold", fontSize: "14px" }}
        >
          ← Back to Movies
        </Link>
      </div>

      <div className="card">
        <img className="poster" src={movie.posterUrl} alt={movie.title} />
        <div className="pad">
          <h1>{movie.title}</h1>
          <p>
            {movie.language} · {movie.certificate} · {movie.durationMin} mins
          </p>
          <p style={{ color: "#666" }}>Playing at {movie.cinema}</p>

          <h2 style={{ marginTop: "24px", borderTop: "1px solid #eee", paddingTop: "16px" }}>
            Select a showtime
          </h2>
          <div className="shows">
            {movie.shows.map((s) => (
              <Link className="show" href={`/booking/${s.id}`} key={s.id}>
                <b>
                  {new Date(s.startsAt).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                  })}
                </b>
                <br />
                <span className="muted">
                  {s.screen.name} · ₹{s.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
