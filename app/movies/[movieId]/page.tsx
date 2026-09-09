import Link from "next/link";
import { fetchFastAPI } from "@/lib/fastapi";

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

  if (!showtimes.length) {
    return (
      <main className="container">
        <h1>Movie not found</h1>
      </main>
    );
  }

  const firstShow = showtimes[0];
  const movie = {
    title: firstShow.movie_title,
    language: firstShow.language,
    certificate: firstShow.certificate,
    durationMin: firstShow.duration_min,
    description: `Now Showing at ${firstShow.cinema_name} • ${firstShow.screen_name}`,
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
    shows: showtimes.map((s) => ({
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
      <div className="card">
        <img className="poster" src={movie.posterUrl} alt={movie.title} />
        <div className="pad">
          <h1>{movie.title}</h1>
          <p>
            {movie.language} · {movie.certificate} · {movie.durationMin} min
          </p>
          <p>{movie.description}</p>
          <h2>Select a show</h2>
          <div className="shows">
            {movie.shows.map((s) => (
              <Link className="show" href={`/booking/${s.id}`} key={s.id}>
                <b>
                  {new Date(s.startsAt).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
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
