import { NextResponse, type NextRequest } from "next/server";
import { GUEST_COOKIE, GUEST_MAX_AGE, TOKEN_COOKIE, cookieBase } from "@/lib/auth/constants";

/**
 * Two jobs, both cheap:
 *  1. Anyone without a session cookie is bounced away from /admin. This is
 *     only the first gate - the admin layout and every admin action verify
 *     the role against the backend.
 *  2. Anonymous visitors get a stable guest id so their cart survives
 *     between visits (the backend keys guest carts by `x-guest-id`).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if (pathname.startsWith("/admin") && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  if (!hasSession && !request.cookies.get(GUEST_COOKIE)?.value) {
    response.cookies.set(GUEST_COOKIE, crypto.randomUUID(), {
      ...cookieBase,
      maxAge: GUEST_MAX_AGE,
    });
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
