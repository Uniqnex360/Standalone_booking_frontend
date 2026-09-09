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

  const isCancelled = ticket.status === "CANCELLED";

  return (
    <main className="container">
      <div
        className={isCancelled ? "card" : "success"}
        style={{
          padding: "24px",
          border: isCancelled ? "1px solid #ef4444" : undefined,
        }}
      >
        {isCancelled ? (
          <>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                fontWeight: "bold",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                marginBottom: "12px",
              }}
            >
              CANCELLED
            </div>

            <h1 style={{ color: "#ef4444", margin: "0 0 12px 0" }}>
              Booking Cancelled 🚫
            </h1>

            <p>
              Ticket Ref: <b>{ticket.ref_code}</b>
            </p>
            <p>
              Movie: <b>{ticket.movie_title}</b>
            </p>
            <p style={{ color: "#666" }}>
              {ticket.cinema_name} • {ticket.screen_name}
            </p>
            <p style={{ color: "#666" }}>
              Showtime:{" "}
              {new Date(ticket.starts_at).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </p>

            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "12px 16px",
                borderRadius: "8px",
                margin: "16px 0",
                fontSize: "14px",
              }}
            >
              ⚠️ This booking was cancelled. The seats have been released back to
              the cinema floor.
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
                fontWeight: "bold",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                marginBottom: "12px",
              }}
            >
              CONFIRMED
            </div>

            <h1 style={{ margin: "0 0 12px 0" }}>Booking Confirmed 🎉</h1>

            <p>
              Ticket Ref: <b>{ticket.ref_code}</b>
            </p>
            <p>
              Movie: <b>{ticket.movie_title}</b>
            </p>
            <p>
              Showtime:{" "}
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
                {ticket.seats && ticket.seats.length > 0
                  ? ticket.seats.map((s: any) => s.code).join(", ")
                  : "None"}
              </b>
            </p>
            <p>
              Amount paid: <b>₹{(ticket.total_price_cents / 100).toFixed(2)}</b>
            </p>
          </>
        )}

        <Link
          className="btn"
          href="/"
          style={{ marginTop: "16px", display: "inline-block" }}
        >
          Book another movie
        </Link>
      </div>
    </main>
  );
}
