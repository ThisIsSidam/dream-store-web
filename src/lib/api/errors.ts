export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  /** 401/403 - the visitor needs to sign in (or sign in as someone else). */
  get isAuth() {
    return this.status === 401 || this.status === 403;
  }
}

type ErrorBody = {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
};

/**
 * The backend reports errors in a few shapes:
 *   { message }                       - RequestError / generic
 *   { error }                         - auth middleware
 *   { message, errors: [{message}] }  - error handler for zod failures
 *   { errors: [zod issues] }          - validateBody middleware
 */
export function extractErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") return fallback;
  const { message, error, errors } = body as ErrorBody;

  const details = Array.isArray(errors)
    ? errors
        .map((e) =>
          e && typeof e === "object" && "message" in e ? String(e.message) : "",
        )
        .filter(Boolean)
        .join(", ")
    : "";

  if (typeof message === "string" && message) {
    return details ? `${message}: ${details}` : message;
  }
  if (typeof error === "string" && error) return error;
  return details || fallback;
}
