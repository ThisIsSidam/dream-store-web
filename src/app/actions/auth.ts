"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { backend } from "@/lib/api/server";
import type { AuthResult } from "@/lib/api/types";
import {
  GUEST_COOKIE,
  TOKEN_COOKIE,
  TOKEN_MAX_AGE,
  cookieBase,
} from "@/lib/auth/constants";
import { safeNext } from "@/lib/utils";

export type AuthState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<"name" | "email" | "password" | "terms", string>>;
      /** Echoed back so a failed submit doesn't wipe the form (React resets it). */
      values?: { name?: string; email?: string };
    }
  | undefined;

const signInSchema = z.object({
  email: z.email("Enter a valid email").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(2, "Enter your name"),
  terms: z.literal("on", "Please accept the privacy policy to continue"),
});

function echo(formData: FormData) {
  return { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") };
}

function fieldErrors(error: z.ZodError): NonNullable<AuthState>["fieldErrors"] {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    out[key] ??= issue.message;
  }
  return out;
}

async function startSession({ token }: AuthResult) {
  const jar = await cookies();
  jar.set(TOKEN_COOKIE, token, { ...cookieBase, maxAge: TOKEN_MAX_AGE });
  // The guest cart has been handed over (sign-up) or is no longer needed.
  jar.delete(GUEST_COOKIE);
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values: echo(formData) };

  let result: AuthResult;
  try {
    result = await backend<AuthResult>("/users/signin", {
      method: "POST",
      body: parsed.data,
      auth: "none",
    });
  } catch (error) {
    return {
      error: error instanceof ApiError ? error.message : "Something went wrong.",
      values: echo(formData),
    };
  }

  await startSession(result);
  const fallback = result.user.role === "admin" ? "/admin" : "/";
  redirect(safeNext(String(formData.get("next") ?? ""), fallback));
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values: echo(formData) };

  const { name, email, password } = parsed.data;
  const guestId = (await cookies()).get(GUEST_COOKIE)?.value;

  let result: AuthResult;
  try {
    result = await backend<AuthResult>("/users/signup", {
      method: "POST",
      // Passing the guest id lets the backend move the guest cart to the new account.
      body: { name, email, password, guestId },
      auth: "none",
    });
  } catch (error) {
    return {
      error: error instanceof ApiError ? error.message : "Something went wrong.",
      values: echo(formData),
    };
  }

  await startSession(result);
  redirect(safeNext(String(formData.get("next") ?? ""), "/"));
}

export async function signOut() {
  (await cookies()).delete(TOKEN_COOKIE);
  redirect("/");
}
