const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000/v1";


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