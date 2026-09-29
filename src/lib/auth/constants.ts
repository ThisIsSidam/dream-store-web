/** httpOnly cookie holding the backend-issued JWT (7 days, matches the backend). */
export const TOKEN_COOKIE = "dream_token";
/** httpOnly cookie holding the anonymous shopper id (used for guest carts). */
export const GUEST_COOKIE = "dream_guest";

export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
export const GUEST_MAX_AGE = 60 * 60 * 24 * 365;

export const cookieBase = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
} as const;
