import "server-only";
import { cookies } from "next/headers";
import { GUEST_COOKIE, TOKEN_COOKIE } from "@/lib/auth/constants";
import { ApiError, extractErrorMessage } from "./errors";

export const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:3000").replace(/\/+$/, "");

type QueryValue = string | number | boolean | null | undefined | (string | number)[];

export type BackendOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  /** Plain objects are sent as JSON, FormData is passed through untouched. */
  body?: unknown;
  /**
   * "user"  - attach the visitor's JWT (or, failing that, their guest id).
   *           Reads cookies, so the calling route renders dynamically.
   * "none"  - anonymous request; safe to cache.
   */
  auth?: "user" | "none";
  /** Seconds to keep the response in Next's data cache. Omit for no caching. */
  revalidate?: number;
  tags?: string[];
};

export function buildUrl(path: string, query?: BackendOptions["query"]) {
  const url = new URL(`${BACKEND_URL}/${path.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null || value === "") continue;
    url.searchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  return url;
}

/**
 * Calls the Node backend from the server and unwraps its `{ success, data }`
 * envelope. Throws {@link ApiError} for any non-2xx response.
 */
export async function backend<T>(path: string, options: BackendOptions = {}): Promise<T> {
  const { method = "GET", query, body, auth = "user", revalidate, tags } = options;

  const headers = new Headers({ Accept: "application/json" });

  if (auth === "user") {
    const jar = await cookies();
    const token = jar.get(TOKEN_COOKIE)?.value;
    const guestId = jar.get(GUEST_COOKIE)?.value;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    else if (guestId) headers.set("x-guest-id", guestId);
  }

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: payload,
      ...(revalidate === undefined
        ? { cache: "no-store" as const }
        : { next: { revalidate, tags } }),
    });
  } catch {
    throw new ApiError("The store backend is unreachable right now.", 503);
  }

  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(json, `Request failed (${response.status})`),
      response.status,
    );
  }

  if (json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}
