import nodemailer from "nodemailer";

export async function sendConfirmation(to:string, booking:any) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email not configured. Confirmation:", {to, bookingId:booking.id});
    return;
  }
  const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT || 587),
    secure:Number(process.env.SMTP_PORT || 587)===465,
    auth:{user:process.env.SMTP_USER, pass:process.env.SMTP_PASS}
  });
  await transporter.sendMail({
    from:process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject:`Booking confirmed - ${booking.movie.title}`,
    html:`<h2>Booking Confirmed</h2><p>Booking ID: <b>${booking.id}</b></p><p>${booking.movie.title}</p><p>${new Date(booking.show.startsAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}</p><p>Screen: ${booking.show.screen.name}</p><p>Seats: ${booking.seats.map((s:any)=>s.seatNo).join(", ")}</p><p>Amount: ₹${booking.amount}</p>`
  });
}