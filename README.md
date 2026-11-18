# Shaqo storefront

## Run locally

Requires Node.js 22.13 or newer. Run `npm ci`, copy `.env.example` to `.env`, set `ADMIN_PASSWORD` to a strong password of at least 12 characters, and run `npm run dev`. The admin dashboard is at `/admin`.

The first run imports the existing catalog and starts with zero stock. Set the real quantity for each size and set the prices for any products with missing prices. Cairo starts with free shipping, as previously advertised. Manage other available areas and their fees in the dashboard.

## Run in production

Use a Node hosting service with a persistent writable disk and a public HTTPS URL. Run `npm ci`, `npm run build`, then `npm start` behind HTTPS. The server listens on `PORT` (8080 by default). Set `SITE_URL` to the store’s public HTTPS origin and set `STORE_DB` to the SQLite file on the persistent disk. Back up the database, which holds orders, inventory, uploaded images, and shipping rates. Run a single application instance so admin sessions are consistent. Restarting the process signs out administrators.

Cash on delivery works once products and shipping are configured. To turn on online payments, add the Paymob secret key, public key, HMAC secret, and comma-separated card or wallet integration IDs from the same Paymob environment. Use test credentials and a publicly reachable HTTPS site first. The transaction callback is `https://your-store.example/api/payment/webhook` and is passed when starting each checkout. Paymob redirects the customer back to the store after checkout, and the order changes to paid when the server verifies Paymob’s callback.

If a payment confirmation arrives after its inventory reservation was released, the order is marked for review. Use its Paymob order ID to reconcile the payment and contact the customer before shipping.

[Paymob credentials](https://developers.paymob.com/paymob-docs/need-help/setup-guides/getting-integration-credentials)
