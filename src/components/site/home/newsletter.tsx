"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { subscribe } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, undefined);

  useEffect(() => {
    if (state?.ok) toast.success("Thanks for subscribing!");
  }, [state]);

  return (
    <section className="bg-white shadow-soft">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div>
          <h2 className="font-display text-lg font-bold">Get new arrivals in your inbox</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Occasional emails about new products. Nothing else.
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
              maxLength={254}
              defaultValue={state?.email}
              aria-invalid={state?.error ? true : undefined}
              aria-describedby={state?.error ? "newsletter-error" : undefined}
              placeholder="Enter your email"
              className="h-11 min-w-0 flex-1 rounded-l-sm border border-r-0 border-outline-variant px-4 text-sm outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
            />
            <Button type="submit" className="h-11 rounded-l-none" loading={pending}>
              Subscribe
            </Button>
          </form>
          {state?.error && (
            <p id="newsletter-error" role="alert" className="mt-2 text-sm text-error">
              {state.error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
