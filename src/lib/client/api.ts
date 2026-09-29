import { ApiError, extractErrorMessage } from "@/lib/api/errors";

type Init = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
};

/**
 * Client-side call to the backend, routed through /api/backend so the
 * httpOnly session cookie is attached server-side.
 */
export async function api<T>(path: string, { method = "GET", body }: Init = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/backend/${path.replace(/^\/+/, "")}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("Can't reach the store. Check your connection and try again.", 503);
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

/** SWR fetcher - the key is the backend path. */
export const swrFetcher = <T>(path: string) => api<T>(path);
