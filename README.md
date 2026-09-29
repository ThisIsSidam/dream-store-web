# Dream Store (web)

The storefront **and** the admin dashboard in one Next.js app. It replaces the
Flutter web app (`dream_store`) and the Angular dashboard (`dream-dashboard`).
The Node backend (`imagination-store`) is unchanged and stays a separate service.

- **Storefront** - home, categories, product lists, search, product page, cart, checkout, orders, account, sign in / up, info pages.
- **Dashboard** - `/admin/*`: products (+ variants and images), users, orders, carts, and home-page content (banners, categories, sections). Admin role only.

## Run it

```bash
cp .env.example .env.local    # set BACKEND_URL
npm install
npm run dev                   # http://localhost:3000 (use -p to change)
```

The backend must be reachable at `BACKEND_URL` (default `http://localhost:3000`, so run one of the two on a different port, e.g. `next dev -p 3001`).

```bash
npm run build && npm start    # production
npm run lint
```

### Making an admin

There is no admin sign-up. Register a normal account, then flip its role in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Sign in at `/signin`; admins get a "Admin dashboard" entry on `/account` and are sent to `/admin` after signing in.

## How it fits together

```
Browser ──► Next.js (this app) ──► Node backend ──► MongoDB
             ├─ server components / actions call the backend directly
             └─ /api/backend/* bridges client-side calls (cart, checkout, live search)
```

**Auth.** The backend's JWT lives in an httpOnly cookie (`dream_token`), never in JS-readable storage. Guests get a random `dream_guest` cookie which is sent as `x-guest-id`, so guest carts work and migrate on sign-up.

**Protecting `/admin`** is layered:

1. [`src/proxy.ts`](src/proxy.ts) redirects requests with no session cookie to `/signin`.
2. [`src/app/admin/layout.tsx`](src/app/admin/layout.tsx) calls `requireAdmin()`, which asks the backend who you are and checks `role === "admin"`.
3. Every admin server action calls `requireAdmin()` again (layouts don't re-run for actions).
4. The backend enforces the role on its admin endpoints regardless.

**Caching.** Public catalogue reads are cached for 60s and expired on demand when an admin edits something (`updateTag`). Anything user-specific is uncached.

**Branding.** Names live in [`src/config/site.ts`](src/config/site.ts); colours and type in [`src/app/globals.css`](src/app/globals.css) (ported from the Flutter theme).

## Layout

```
src/
  proxy.ts                  guest cookie + /admin gate
  config/site.ts            store name, tagline, currency
  lib/api/                  backend client (server.ts), catalogue/shop/admin queries, types
  lib/auth/                 cookie names, getSession / requireUser / requireAdmin
  lib/client/               browser-side api helper + SWR cart hook
  app/(site)/               storefront pages
  app/(auth)/               sign in / sign up
  app/admin/                dashboard pages
  app/actions/              server actions (auth, admin mutations)
  app/api/backend/          allow-listed bridge to the backend
  app/api/admin/upload/     product image upload
  components/               ui/, site/, product/, cart/, orders/, admin/
```

## Known gaps (backend or product decisions)

- **No way to remove a cart line.** The API only *adds* a (possibly negative) quantity, and the schema rejects 0. The cart's "-" stops at 1.
- **Payment is simulated.** "Finalize Manifestation" calls `POST /orders/confirm-payment`, which any signed-in user can call for their own order. Put a real payment provider (and a webhook) in front of that before selling anything.
- **Newsletter form stores nothing** - there is no endpoint for it yet.
- **Info pages** (`/returns`, `/support`, `/privacy`) contain placeholder copy.
- Guests can't check out (the backend requires a signed-in user for orders).
