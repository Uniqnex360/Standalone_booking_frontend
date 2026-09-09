"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      if (res.status === 401) {
        setIsLoggedOut(true);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load bookings");
        return;
      }
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to cancel");
        return;
      }
      alert("Booking cancelled successfully. Seats are now available.");
      loadBookings();
    } catch (err: any) {
      alert(err.message || "Cancellation failed");
    }
  };

  if (loading) {
    return (
      <main className="container" style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "#666" }}>Loading your bookings...</p>
      </main>
    );
  }

  if (isLoggedOut) {
    return (
      <main className="container" style={{ maxWidth: "480px", marginTop: "40px", textAlign: "center" }}>
        <div className="card" style={{ padding: "32px" }}>
          <h2 style={{ margin: "0 0 8px 0" }}>Sign In to View Bookings</h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
            Please log in with your account to see your booked movie tickets.
          </p>
          <Link className="btn" href="/login" style={{ display: "inline-block", padding: "10px 24px" }}>
            Login / Register
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>My Bookings</h1>
      {error && <p className="error">{error}</p>}

      {bookings.length === 0 ? (
        <div className="card" style={{ padding: "30px", textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: "16px" }}>You have no active bookings.</p>
          <Link className="btn" href="/">
            Explore Showtimes
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {bookings.map((b) => {
            const isCancelled = b.status === "CANCELLED";
            return (
              <div
                key={b.id}
                className="card"
                style={{
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backgroundColor: isCancelled ? "#fee2e2" : "#dcfce7",
                      color: isCancelled ? "#dc2626" : "#16a34a",
                    }}
                  >
                    {b.status}
                  </span>
                  <h3 style={{ margin: "8px 0 4px 0" }}>{b.movie_title}</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                    {b.cinema_name} • {b.screen_name}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                    Seats: <b>{b.seats.map((s: any) => s.code).join(", ")}</b> | Ref:{" "}
                    <code>{b.ref_code}</code>
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#888" }}>
                    {new Date(b.starts_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link className="btn" href={`/confirmation/${b.ref_code}`}>
                    View Ticket
                  </Link>
                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
