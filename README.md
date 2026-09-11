# MileMitra — carpooling website prototype

MileMitra is an original India-first carpooling UX concept built after benchmarking common patterns in BlaBlaCar, Uber, Porter, Quick Ride and sRide. It is intentionally not a visual clone of any of them.

## What is included

- Responsive home page and mobile bottom navigation
- Find Ride flow with route-fit, detour, trust and comfort-match sample scoring
- Offer Ride flow with seats, cost share, route flexibility, approval mode and preferences
- Google Maps JavaScript + Places integration hook
- Browser geolocation for precise pickup
- Razorpay checkout integration hook, with demo payment fallback
- Optional Express API for Razorpay order creation and signature verification
- Safety Center concept: Trust Rings, PIN, trip sharing, route anomaly concept and private communication
- Company commute page with aggregate commute/ESG dashboard concept
- Help/FAQ, signup/login/demo modals
- Mobile-first responsive layout

## Run the front end

From this folder:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Enable Google Maps

1. Create a Google Cloud project and enable Maps JavaScript API and Places API.
2. Create a browser API key and restrict it to your web domain/referrer.
3. Put the browser key in `config.js` as `GOOGLE_MAPS_API_KEY`.
4. For production, route calculation, distance matrix and sensitive operations should be server-side where appropriate.

## Enable Razorpay

Front end:
- Put only the public `key_id` in `config.js`.
- Set `API_BASE_URL` to the deployed API URL.

Server:

```bash
npm install
cp .env.example .env
# add your real test/live keys
npm start
```

Do not place the Razorpay secret in browser code. In production, also verify webhooks and payment signatures server-side before confirming a booking.

## Production architecture recommended

- Front end: Next.js/React or the current static prototype progressively upgraded
- API: Node/NestJS or Java/Spring Boot
- Database: PostgreSQL + PostGIS for route/geo queries
- Cache/queues: Redis
- Maps: Google Maps Platform (Places, Routes, Geocoding)
- Payments: Razorpay with UPI/cards/netbanking/wallets as enabled on merchant account
- Auth: OTP + passkeys/social login; separate KYC verification service
- Messaging: masked calling/chat provider; never expose phone numbers by default
- Notifications: FCM/APNs + email/SMS provider
- Storage: encrypted object storage for verification documents with strict retention
- Observability: centralized logs, metrics, tracing, fraud and abuse monitoring

## Matching model idea

Example score weights:
- 40% route overlap / total detour
- 20% pickup + drop walking effort
- 15% timing alignment / flexibility
- 10% trust verification level
- 10% user rating / cancellation reliability
- 5% comfort preference compatibility

These weights should be tested with real users rather than hard-coded as a permanent policy.

## Before a public launch

This prototype is not a complete regulated transport platform. Obtain legal review for state/city transport rules, carpool cost-sharing, insurance, GST/tax treatment, payments/KYC, grievance processes and consumer protection. Implement DPDP-compliant notices/consent, purpose limitation, retention, deletion, data-principal rights, security controls and breach processes. Accessibility, safety escalation, anti-discrimination rules and moderation also need production policies and operational staffing.
