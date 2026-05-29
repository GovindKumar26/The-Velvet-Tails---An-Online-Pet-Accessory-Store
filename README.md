# Velvet Tails — Production E-commerce (Freelance Project)

## What it does
Velvet Tails is a production-ready e-commerce store for pet accessories. It provides product discovery, search and filtering, cart and secure checkout, PayU payment processing, downloadable invoices, Shiprocket shipping and tracking, order history, refunds/returns, and admin dashboards for products, discounts and tax configuration.

## Why I built this
This was a freelance project for a merchant who needed a dependable webshop that handled real business operations — accurate payments, predictable shipping, and clear invoices for accounting. While working on the store I repeatedly ran into reconciliation and tracking issues in production; building Velvet Tails was about eliminating those operational gaps and making merchant workflows auditable and reliable.


## How to run (quick)
Prerequisites: Node.js 18+, npm, MongoDB (local or cloud), Cloudinary account (for product images), PayU sandbox credentials, Shiprocket credentials.

1. Backend

```bash
cd backend
npm install
# create .env with MONGO_URI, PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT,
# SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_PICKUP_LOCATION,
# JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CLOUDINARY_* etc.
npm run dev
```

Server entry: `cd Pet-Accessory-Store-Backend
/server.js`. For LiteSpeed/shared hosting use `backend/server-litespeed.cjs`.

2. Frontend

```bash
cd frontend
npm install
# set VITE_API_URL in .env to e.g. http://localhost:5000/api
npm run dev
```

Frontend entry: `cd Pet-Accessory-Store-Frontend
/src/App.jsx`.

3. Health check

```bash
curl http://localhost:5000/api/health
or
https://thevelvettails.com/api/health
```

## Key features and where to look
- Server entry & deploy bootstrap: `backend/server.js`, `backend/server-litespeed.cjs`
- Payment & PayU: `backend/routes/payments.js` (hash generation, verify API)
- Order flows and server-side price validation: `backend/routes/orders.js`
- Shiprocket integration and tracking sync: `backend/services/shiprocket.js`, `backend/services/shiprocketSync.js` (cron job)
- Invoice generation (PDFKit): `backend/services/invoiceService.js`
- Discounts & admin CRUD: `backend/routes/admin.js` and `backend/routes/discounts.js`
- Models (money stored in paise): `backend/models/Product.js`, `backend/models/Order.js`
- Frontend API client with token refresh: `frontend1/src/services/api.js`

## Architecture decisions (non-trivial)
- Money stored as integers in paise to avoid floating point errors and rounding ambiguity.
- Server-side final price calculation and verification before initiating or marking payments — prevents client-side tampering.
- PayU integration uses server-generated request hashes, response hash checks, and an additional verify API call. Payment attempts and raw gateway responses are stored for idempotency and audit.
- Shiprocket interactions are encapsulated in a service with token caching and retry logic; tracking is synced periodically (cron) to keep the DB as the source of truth for logistics.
- Invoice PDFs are generated server-side with PDFKit to ensure reproducible, downloadable receipts for accounting.
- Rate limiting applied to sensitive routes (auth, payments, admin) to reduce abuse and accidental overload.
- `server-litespeed.cjs` exists to bootstrap DB connection reliably in shared/LiteSpeed hosting environments that expect a CommonJS entrypoint.

## What I used AI for
- Frontend color-scheme implementations
- Ingesting animations on the frontend
- Reviewing the codebase and suggestions to make security harder
- All security-critical code (payment verification, idempotency, token handling) was implemented and reviewed by hand; AI suggestions that weakened server-side checks or suggested trusting client totals were overridden. For example, I ended up overriding AI suggestion of handling of money(rupee vs paise). Because PayU expects everything in Paise but DB was supposed to store prices/payments in Rupee. But I overrode this architechtural decision to not be stuck in precision errors eventually, that come up frequently while handling fractions (like in case of taxes, discounts, etc). 
- Another time I overrode the AI decision was when it only used callback based verification of payment in PayU. I included verify API callbacks, and webhooks for better verification and reconciliation for payments. 

## What I learned (notable engineering lessons)
- Polling vs WebSockets: polling + cron is pragmatic for courier sync; WebSockets are better for immediate real-time updates but add complexity.
- Nodemailer is reliable for transactional emails when templates and error handling are carefully managed.
- PDFKit is effective for invoice generation but requires careful layout work for GST and multi-line rows.
- External integrations (payments, shipping) need retries, idempotency, and defensive parsing of vendor responses.
- Rate limiting is essential for protecting payment and auth endpoints in production.
- Deploying on shared hosts (MilesWeb/LiteSpeed) surfaces environment differences; a `.cjs` bootstrap can fix startup ordering issues.

## What I would change with 4 more weeks
- Add real-time WebSocket notifications for order/shipping updates and admin alerts instead of polling.
- Replace cron with a robust job worker (BullMQ).
- Add in-app notification service.
- Harden admin RBAC, add 2FA, and an audit log for admin actions.
- Build scheduled invoice/report exports and admin analytics.
- Use Tanstack Query for server side state management, inbuilt client-side caching, Loading states, Error states, Optimistic updates, Background refetching.
- Add observability (Prometheus)
- Add SMS or WhatsApp notifications 