# Dream Store (web)

The storefront **and** the admin dashboard in one Next.js app. It talks to the
Node backend (`../dream-store-backend`), which keeps its data in Supabase.

- **Storefront** - home, categories, product lists, search, product page, cart, checkout, orders, account, sign in / up, info pages.
- **Dashboard** - `/admin/*`: products (+ variants and images), users, orders, carts, newsletter subscribers, and home-page content (banners, categories, sections). Admin role only.

## Run it

```bash
cp .env.example .env.local    # set BACKEND_URL
npm install
npm run dev                   # http://localhost:3000 (use -p to change)
```

The backend must be reachable at `BACKEND_URL` (default `http://localhost:3411`, the backend's default port).

```bash
npm run build && npm start    # production
npm run lint
npm run typecheck
npm test                      # unit tests for the pure helpers
npm run check                 # typecheck + lint + tests
```

### Making an admin

There is no admin sign-up. The backend's seed script (`npm run seed` there) creates `admin@dreamstore.com`
(password `admin123` on a local stack; otherwise from `SEED_ADMIN_PASSWORD` or generated). To promote someone else,
set `role = 'admin'` on their row in the Supabase table editor.

Sign in at `/signin`; admins get a "Admin dashboard" entry on `/account` and are sent to `/admin` after signing in.

## How it fits together

```
Browser ──► Next.js (this app) ──► Node backend ──► Supabase (Postgres + Storage)
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

**Look.** The storefront follows a traditional marketplace layout: red header with wide search, category bar, white panels on a light grey page, orange Add to cart / Buy now buttons, a "Price details" panel in the cart and checkout, and a dark footer. Product pages show real data: price range and stock from the variants, and ratings computed from actual reviews. Photos come from Supabase Storage; a product without one (or whose photo fails to load) shows its built-in SVG artwork.

**Quotes and lines.** There are no physical goods: each unit bought is delivered as a quote written for the product. The product page explains this, the order page shows the lines sealed until the order is Delivered (the page polls, so they open live), and admins manage a product's pool on its admin page ("Quotes and lines").

**Branding.** Names live in [`src/config/site.ts`](src/config/site.ts); colours and type in [`src/app/globals.css`](src/app/globals.css) (brand colours).

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

- **Payment is simulated.** "Finalize Manifestation" calls `POST /orders/confirm-payment`, which now only lets the order's owner confirm it, but still needs no real payment. Put a payment provider (and a webhook that confirms the order) in front of that before selling anything.
- **Newsletter has no unsubscribe link.** Addresses are stored (`/admin/newsletter` lists them and can remove one), but there is no public unsubscribe flow or mailer.
- **Info pages** (`/returns`, `/support`, `/privacy`) still need your real policies. Set `supportEmail` in `src/config/site.ts` for the support page.
- Guests can't check out (the backend requires a signed-in user for orders); their cart is kept when they sign in or up.
