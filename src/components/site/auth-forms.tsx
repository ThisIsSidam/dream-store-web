"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { FormError } from "@/components/site/form-error";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  const signUpHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      <h1 className="font-display text-2xl font-bold md:sr-only">Login</h1>
      <FormError message={state?.error} />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state?.values?.email}
        placeholder="you@example.com"
        error={state?.fieldErrors?.email}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter password"
        error={state?.fieldErrors?.password}
        required
      />
      <Button type="submit" variant="buy" size="lg" loading={pending}>
        Login
      </Button>
      <p className="text-center text-sm">
        <Link href={signUpHref} className="font-semibold text-primary hover:underline">
          New here? Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signUp, undefined);
  const signInHref = next ? `/signin?next=${encodeURIComponent(next)}` : "/signin";

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      <h1 className="font-display text-2xl font-bold md:sr-only">Sign up</h1>
      <FormError message={state?.error} />
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        defaultValue={state?.values?.name}
        placeholder="Your name"
        error={state?.fieldErrors?.name}
        required
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state?.values?.email}
        placeholder="you@example.com"
        error={state?.fieldErrors?.email}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 6 characters"
        error={state?.fieldErrors?.password}
        required
      />
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="terms" required className="mt-0.5 size-4 shrink-0 accent-primary" />
          <span className="text-sm text-on-surface-variant">
            I agree to the{" "}
            <Link href="/privacy" className="font-semibold text-primary hover:underline" target="_blank">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {state?.fieldErrors?.terms && (
          <p className="mt-1 text-sm text-error" role="alert">
            {state.fieldErrors.terms}
          </p>
        )}
      </div>
      <Button type="submit" variant="buy" size="lg" loading={pending}>
        Sign up
      </Button>
      <p className="text-center text-sm">
        <Link href={signInHref} className="font-semibold text-primary hover:underline">
          Already have an account? Login
        </Link>
      </p>
    </form>
  );
}
