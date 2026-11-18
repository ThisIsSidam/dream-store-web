const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Source of the pattern the bridge route uses for ids in a path. Every product,
 * variant, order, user and section id is a UUID; checking it before calling the
 * backend turns a typo in a URL into a 404 instead of a failed request.
 */
export const UUID_PATTERN = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

/** True for a well-formed id of a backend record. */
export const isEntityId = (value: unknown): value is string =>
  typeof value === "string" && UUID.test(value);
