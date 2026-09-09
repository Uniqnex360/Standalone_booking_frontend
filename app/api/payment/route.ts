import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { bookingId } = await req.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    paymentId: `PAY-${Date.now()}`,
    bookingId,
  });
}
