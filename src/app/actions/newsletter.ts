"use server";

import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { backend } from "@/lib/api/server";

export type SubscribeState =
  | { ok: true; error?: undefined; email?: undefined }
  | { ok?: false; error: string; email: string }
  | undefined;

const schema = z.object({ email: z.email("That doesn't look like an email address").trim() });

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "");
  const parsed = schema.safeParse({ email });
  if (!parsed.success) return { error: parsed.error.issues[0].message, email };

  try {
    await backend("/newsletter/subscribe", {
      method: "POST",
      body: { email: parsed.data.email },
      auth: "none",
    });
  } catch (error) {
    return {
      error: error instanceof ApiError ? error.message : "Something went wrong. Try again in a moment.",
      email,
    };
  }
  return { ok: true };
}
