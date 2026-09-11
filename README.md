# GoBuddy

GoBuddy is a responsive carpooling product prototype focused on route-fit, human-fit, trust and predictable shared commuting.

## Included
- Dynamic SPA navigation: Home, Find, Offer, Safety, GoBuddy Work, Rewards, Profile and Help.
- Live filtering/sorting of sample rides and local saved/booked ride state.
- Offer-a-ride preview, recurring weekday controls and local published-ride state.
- Demo authentication/profile, progressive Trust Ring, help search and dark mode.
- Google Maps/Places hooks via `config.js`.
- Razorpay-ready order API in `server.js` with server-side secret usage.
- Vercel-compatible root route and exported Express app.

## Local run
```bash
npm install
npm start
```
Open `http://localhost:3000`.

## Google Maps
Put a browser-restricted Maps JavaScript / Places key in `config.js` under `GOOGLE_MAPS_API_KEY`. Do not put server secrets in client files.

## Razorpay
Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Vercel Environment Variables. Put the public key ID in `config.js` only if you want live Checkout to open. The secret must remain server-side.

## Production work still required
Real authentication/OTP, database, ride CRUD, Maps Routes matching, messaging, notifications, KYC/verification vendors, payment verification/webhooks/refunds, moderation, emergency operations, audit logs, privacy/retention controls and legal/insurance review.
