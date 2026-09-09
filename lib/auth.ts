import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export async function createSession(userId:string) {
  const token = await new SignJWT({userId}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(secret);
  const jar = await cookies();
  jar.set("session", token, {httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:60*60*24*7});
}

export async function getUserId() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, secret)).payload.userId as string; } catch { return null; }
}