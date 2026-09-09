"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Seat {
  id: string;
  code: string;
  number: number;
  price_cents: number;
  status: "AVAILABLE" | "BOOKED";
}

interface Row {
  label: string;
  price_cents: number;
  seats: Seat[];
}

interface SeatMapData {
  showtime_id: string;
  movie_title: string;
  screen_name: string;
  cinema_name: string;
  starts_at: string;
  rows: Row[];
}

export default function BookingPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [data, setData] = useState<SeatMapData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/seats?showId=${bookingId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((err) => setError(err.message));
  }, [bookingId]);

  if (error) {
    return (
      <main className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ color: "#ef4444" }}>{error}</h2>
        <Link className="btn" href="/" style={{ marginTop: "16px", display: "inline-block" }}>
          Back to Movies
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ fontSize: "16px", color: "#666" }}>Loading seat map...</p>
      </main>
    );
  }

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== "AVAILABLE") return;

    const exists = selectedSeats.some((s) => s.id === seat.id);
    if (exists) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        alert("You can select a maximum of 10 seats per booking.");
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price_cents / 100, 0);

  const handlePay = async () => {
    if (selectedSeats.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId: bookingId,
          seatIds: selectedSeats.map((s) => s.id),
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "Booking failed");
        setLoading(false);
        return;
      }

      router.push(`/confirmation/${resData.booking.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to connect to booking service");
      setLoading(false);
    }
  };

  const tiers: { name: string; price: number; rows: Row[] }[] = [];
  data.rows.forEach((row) => {
    const price = row.price_cents / 100;
    let tierName = "CLASSIC";
    if (price >= 350) tierName = "RECLINER / VIP";
    else if (price >= 250) tierName = "PRIME PLUS";

    let existingTier = tiers.find((t) => t.price === price);
    if (!existingTier) {
      existingTier = { name: tierName, price, rows: [] };
      tiers.push(existingTier);
    }
    existingTier.rows.push(row);
  });

  return (
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px 120px 16px" }}>
       <div style={{ marginBottom: "16px" }}>
        <Link href={`/movies/${bookingId}`} style={{ textDecoration: "none", color: "#f11d48", fontWeight: "bold", fontSize: "14px" }}>
          ← Back to Showtimes
        </Link>
      </div>
      <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "14px", marginBottom: "20px" }}>
        <h1 style={{ margin: "0 0 4px 0", fontSize: "24px" }}>{data.movie_title}</h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
          {data.cinema_name} • {data.screen_name} |{" "}
          <b>
            {new Date(data.starts_at).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata",
            })}
          </b>
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: "auto", padding: "10px 0 30px 0" }}>
        <div style={{ minWidth: "680px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ marginTop: "40px", width: "70%", textAlign: "center" }}>
            <div
              style={{
                height: "6px",
                width: "100%",
                background: "linear-gradient(to bottom, #93c5fd, #bfdbfe)",
                borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                boxShadow: "0 -2px 10px rgba(147, 197, 253, 0.5)",
                marginBottom: "8px",
              }}
            />
            <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", fontWeight: "bold" }}>
              All eyes this way please (Screen)
            </span>
          </div>
          {tiers.map((tier) => (
            <div key={tier.price} style={{ width: "100%" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#9ca3af",
                  borderBottom: "1px solid #f3f4f6",
                  paddingBottom: "6px",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {tier.name} — ₹{tier.price.toFixed(2)}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {tier.rows.map((row) => {
                  const midIndex = Math.floor(row.seats.length / 2);

                  return (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "24px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: "#9ca3af",
                          textAlign: "center",
                        }}
                      >
                        {row.label}
                      </span>

                      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        {row.seats.map((seat, index) => {
                          const isSelected = selectedSeats.some((s) => s.id === seat.id);
                          const isBooked = seat.status === "BOOKED";

                          // Add Walkway gap in the middle
                          const isAisle = index === midIndex;

                          return (
                            <div key={seat.id} style={{ display: "flex", alignItems: "center" }}>
                              {isAisle && <div style={{ width: "24px" }} />}
                              <button
                                type="button"
                                disabled={isBooked}
                                onClick={() => toggleSeat(seat)}
                                title={`${seat.code} • ₹${seat.price_cents / 100}`}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: isBooked ? "not-allowed" : "pointer",
                                  transition: "all 0.15s ease",
                                  border: isBooked
                                    ? "1px solid transparent"
                                    : isSelected
                                    ? "1px solid #16a34a"
                                    : "1px solid #10b981",
                                  backgroundColor: isBooked
                                    ? "#e5e7eb"
                                    : isSelected
                                    ? "#16a34a"
                                    : "#ffffff",
                                  color: isBooked
                                    ? "#9ca3af"
                                    : isSelected
                                    ? "#ffffff"
                                    : "#059669",
                                  boxShadow: isSelected ? "0 2px 4px rgba(22, 163, 74, 0.3)" : "none",
                                }}
                              >
                                {seat.number}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <span
                        style={{
                          width: "24px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: "#9ca3af",
                          textAlign: "center",
                        }}
                      >
                        {row.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          

          <div style={{ display: "flex", gap: "24px", fontSize: "12px", color: "#6b7280", marginTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "16px", height: "16px", border: "1px solid #10b981", borderRadius: "4px", backgroundColor: "#fff" }} />
              <span>Available</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "16px", height: "16px", backgroundColor: "#16a34a", borderRadius: "4px" }} />
              <span>Selected</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "16px", height: "16px", backgroundColor: "#e5e7eb", borderRadius: "4px" }} />
              <span>Sold</span>
            </div>
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            padding: "16px 24px",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Seats ({selectedSeats.length}):{" "}
                <b style={{ color: "#111827" }}>{selectedSeats.map((s) => s.code).join(", ")}</b>
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#111827" }}>
                ₹{totalPrice.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              style={{
                backgroundColor: "#e11d48", // BookMyShow Red / Primary action
                color: "#ffffff",
                border: "none",
                fontWeight: "bold",
                fontSize: "15px",
                padding: "12px 28px",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(225, 29, 72, 0.3)",
                transition: "background 0.2s ease",
              }}
            >
              {loading ? "Processing..." : `Pay ₹${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
