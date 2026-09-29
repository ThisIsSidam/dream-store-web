import { NextResponse, type NextRequest } from "next/server";
import { buildUrl } from "@/lib/api/server";
import {
  GUEST_COOKIE,
  GUEST_MAX_AGE,
  TOKEN_COOKIE,
  cookieBase,
} from "@/lib/auth/constants";

/**
 * Browser -> Next -> backend bridge for the storefront's client-side calls
 * (cart, checkout, live search). It keeps the JWT in an httpOnly cookie:
 * the browser never sees the token, this handler adds it to the request.
 *
 * Only the endpoints the storefront needs are reachable; the admin
 * dashboard talks to the backend from server actions instead.
 */
const ALLOWED = [
  /^cart$/,
  /^cart\/add$/,
  /^orders$/,
  /^orders\/(buy-now|confirm-payment|payment-failed)$/,
  /^orders\/[0-9a-f]{24}$/i,
  /^products\/search$/,
];

const DEAD_TOKEN = /invalid or expired token|user not found|invalid token/i;

async function handler(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  const target = path.join("/");

  if (!ALLOWED.some((pattern) => pattern.test(target))) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const isRead = request.method === "GET";
  if (!isRead) {
    // Cookies are SameSite=Lax already; this is belt and braces.
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  let guestId = request.cookies.get(GUEST_COOKIE)?.value;
  const issueGuestId = !token && !guestId;
  if (issueGuestId) guestId = crypto.randomUUID();

  const headers = new Headers({ Accept: "application/json" });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  else if (guestId) headers.set("x-guest-id", guestId);

  let body: string | undefined;
  if (!isRead) {
    body = await request.text();
    if (body) headers.set("Content-Type", "application/json");
  }

  let upstream: Response;
  try {
    upstream = await fetch(buildUrl(target, Object.fromEntries(request.nextUrl.searchParams)), {
      method: request.method,
      headers,
      body: body || undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "The store backend is unreachable right now." },
      { status: 503 },
    );
  }

  const text = await upstream.text();
  const response = new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

  if (issueGuestId && guestId) {
    response.cookies.set(GUEST_COOKIE, guestId, { ...cookieBase, maxAge: GUEST_MAX_AGE });
  }
  if (upstream.status === 401 && token && DEAD_TOKEN.test(text)) {
    response.cookies.delete(TOKEN_COOKIE);
  }
  return response;
}

export { handler as GET, handler as POST };
