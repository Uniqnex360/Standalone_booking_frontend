"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setUser(d?.user || null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    location.href = "/";
  }

  return (
    <nav className="nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px" }}>
      <Link className="brand" href="/" style={{ fontWeight: "bold", fontSize: "18px" }}>
        Chennai Cinemas
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {user ? (
          <>
            <Link href="/my-bookings" style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}>
              🎟️ My Bookings
            </Link>
            <span>
              <b>{user.name}</b> ·{" "}
              <button onClick={logout} style={{ cursor: "pointer", background: "none", border: "none", color: "#ef4444" }}>
                Logout
              </button>
            </span>
          </>
        ) : (
          <Link href="/login" style={{ fontWeight: "bold" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}