import { cookies } from "next/headers";


export async function createSession(fastapiToken: string) {
  const jar = await cookies();
  jar.set("session", fastapiToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, 
  });
}


export async function getSessionToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get("session")?.value || null;
}


export async function clearSession() {
  const jar = await cookies();
  jar.delete("session");
}