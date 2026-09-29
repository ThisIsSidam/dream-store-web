"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Cosmetic for now: there is no newsletter endpoint on the backend yet, so
 * nothing is stored. Wire this to a real list before launch.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    toast.success("The paradox will find you.");
    setEmail("");
  }

  return (
    <section className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl rounded-[400px_200px_350px_150px/200px_150px_200px_350px] max-md:rounded-[40px] bg-primary-container/20 px-6 py-16 text-center md:px-12 md:py-20">
        <h2 className="t-headline-lg text-primary">Subscribe to the Paradox</h2>
        <p className="t-body-lg mx-auto mt-8 max-w-xl text-on-primary-container/80">
          Get notified when we capture new impossibilities. No spam, just weirdness.
        </p>
        <form onSubmit={onSubmit} className="mx-auto mt-12 flex max-w-lg flex-col gap-4 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your inter-dimensional email"
            className="t-body-md h-16 min-w-0 flex-1 rounded-full border-4 border-primary bg-surface-container-lowest px-8 outline-none placeholder:text-on-surface-variant/60 focus:ring-4 focus:ring-primary-container/40"
          />
          <Button type="submit" size="xl" className="h-16">
            Get Weird
          </Button>
        </form>
      </div>
    </section>
  );
}
