import Link from "next/link";
import { fetchFastAPI } from "@/lib/fastapi";

export default async function Confirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let ticket: any = null;
  try {
    ticket = await fetchFastAPI(`/tickets/${id}`);
  } catch (err) {
    console.error("Failed to load ticket from FastAPI:", err);
  }

  if (!ticket) {
    return (
      <main className="container">
        <h1>Booking not found</h1>
        <p className="muted">Could not find reference: {id}</p>
        <Link className="btn" href="/">
          Return to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="success">
        <h1>Booking Confirmed 🎉</h1>
        <p>
          Ticket Ref: <b>{ticket.ref_code}</b>
        </p>
        <p>
          <b>{ticket.movie_title}</b>
        </p>
        <p>
          {new Date(ticket.starts_at).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </p>
        <p>
          {ticket.cinema_name} • {ticket.screen_name}
        </p>
        <p>
          Seats:{" "}
          <b>
            {ticket.seats.map((s: any) => s.code).join(", ")}
          </b>
        </p>
        <p>
          Amount paid: <b>₹{(ticket.total_price_cents / 100).toFixed(2)}</b>
        </p>
        <Link className="btn" href="/">
          Book another movie
        </Link>
      </div>
    </main>
  );
}
