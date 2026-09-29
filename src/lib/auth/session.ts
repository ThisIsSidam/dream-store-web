import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backend } from "@/lib/api/server";
import type { User } from "@/lib/api/types";
import { TOKEN_COOKIE } from "./constants";

type MeResponse = Omit<User, "id"> & { _id: string };

/**
 * The signed-in user, or `null` for guests / expired sessions.
 * Memoised per request, so layouts and pages can both call it freely.
 */
export const getSession = cache(async (): Promise<User | null> => {
  const jar = await cookies();
  if (!jar.get(TOKEN_COOKIE)?.value) return null;

  try {
    // /users/me returns the raw mongoose document, so `_id`, not `id`.
    const me = await backend<MeResponse>("/users/me");
    return {
      id: me._id,
      name: me.name,
      email: me.email,
      role: me.role,
      createdAt: me.createdAt,
    };
  } catch {
    return null;
  }
});

/** For pages that only make sense when signed in. */
export async function requireUser(next: string): Promise<User> {
  const user = await getSession();
  if (!user) redirect(`/signin?next=${encodeURIComponent(next)}`);
  return user;
}

/**
 * The gate for everything under /admin. Call it in the layout *and* at the
 * top of every server action - layouts don't re-run for action requests, and
 * the backend re-checks the role on each call anyway.
 */
export async function requireAdmin(next = "/admin"): Promise<User> {
  const user = await requireUser(next);
  if (user.role !== "admin") redirect("/account?denied=admin");
  return user;
}
