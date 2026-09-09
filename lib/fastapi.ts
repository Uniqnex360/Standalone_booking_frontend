const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000/v1";

/**
 * Fetch helper for communicating with FastAPI backend.
 */
export async function fetchFastAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${FASTAPI_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorDetail = `FastAPI error: ${response.status}`;
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {
      // not json
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

/**
 * Automatically obtains a verified JWT token from FastAPI
 * for the user (or demo user fallback).
 */
export async function getFastAPIToken(userEmail?: string): Promise<string> {
  const email = userEmail || "demo@pvr.local";
  const password = "demo1234";

  try {
    const res = await fetchFastAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.token;
  } catch {
    // If user doesn't exist in FastAPI, register them
    try {
      const reg = await fetchFastAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return reg.token;
    } catch {
      // Fallback to seeded demo user
      const demo = await fetchFastAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "demo@pvr.local", password: "demo1234" }),
      });
      return demo.token;
    }
  }
}
