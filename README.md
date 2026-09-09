# Chennai Movie Booking

A small PVR-style internal movie booking application with:
- 2 fictional movies
- 2 screens
- Multiple daily show timings
- Registration/login with HTTP-only JWT cookie
- Seat selection
- Booking + seat locking
- Mock payment flow
- SMTP confirmation email
- REST API endpoints for integrating with another application
- SQLite + Prisma for simple internal deployment

## 1. Install

```bash
npm install
cp .env.example .env
```

Set a strong `JWT_SECRET`.

## 2. Database

```bash
npx prisma migrate dev --name init
npm run seed
```

## 3. Run

```bash
npm run dev
```

Open http://localhost:3000

## Real email

Fill SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and EMAIL_FROM in `.env`.
For Gmail, use an App Password rather than your normal Gmail password.

## Payment

The included `/api/payment` endpoint is deliberately a mock payment adapter so the application can run internally without a payment gateway.

For production, replace the mock logic with Razorpay/Stripe/etc. The intended flow is:
1. Create a pending booking and lock seats.
2. Create a payment order with the provider.
3. Return the provider order/client details to the frontend.
4. Verify the provider signature/webhook server-side.
5. Mark booking CONFIRMED and seats BOOKED.
6. Send confirmation email.

## API

### GET /api/movies
List movies and their shows.

### GET /api/shows?movieId=<movieId>
List shows for a movie.

### GET /api/seats?showId=<showId>
Return show details and seat availability.

### POST /api/auth/register
```json
{"name":"Test User","email":"test@example.com","password":"secret123"}
```

### POST /api/auth/login
```json
{"email":"test@example.com","password":"secret123"}
```

### POST /api/bookings
Requires logged-in session.
```json
{"showId":"SHOW_ID","seatIds":["SEAT_ID_1","SEAT_ID_2"]}
```

### POST /api/payment
Requires logged-in session.
```json
{"bookingId":"BOOKING_ID"}
```

For an external application, you can consume these endpoints directly or put an API gateway in front of them.

## Important production upgrades

- Use PostgreSQL instead of SQLite.
- Add proper payment provider integration and server-side signature/webhook verification.
- Add short-lived seat holds with expiry rather than indefinite LOCKED state.
- Add transaction/locking strategy appropriate for the production database.
- Add rate limiting, CSRF protection where applicable, audit logs and monitoring.
- Add admin APIs to create/update movies, screens and shows.
- Add logout and password reset.
- Store posters in object storage/CDN rather than remote demo URLs.
# Standalone_booking_frontend
