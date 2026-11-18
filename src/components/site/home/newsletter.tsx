"use client";

import { subscribe } from "@/app/actions/newsletter";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Subscribed to questionable dispatches.", {
        description: "Prepare for unwarranted correspondence.",
      });
    }
  }, [state]);

  return (
    <section className="bg-white shadow-soft">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div>
          <h2 className="font-sans text-xl font-bold text-neutral-900">
            Get notified about things you probably don&apos;t need.
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Occasional dispatches regarding newly discovered anomalies.
            Unsubscribe whenever reality permits.
          </p>
        </div>
        <div className="w-full md:max-w-md">
          <form action={action} className="flex">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              defaultValue={state?.email}
              aria-describedby={state?.error ? "newsletter-error" : undefined}
              placeholder="Enter your email..."
              className="h-11 min-w-0 flex-1 rounded-l-md border border-neutral-300 bg-white px-4 text-xs sm:text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={pending}
              className="h-11 rounded-r-md bg-neutral-900 px-5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-60"
            >
              {pending ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
          {state?.error && (
            <p
              id="newsletter-error"
              role="alert"
              className="mt-2 text-sm text-error"
            >
              {state.error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
