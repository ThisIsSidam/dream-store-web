"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AtSign, Lock, ShieldCheck, User } from "lucide-react";
import { signIn, signUp } from "@/app/actions/auth";
import { AuthCard, FormError } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  const signUpHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <AuthCard>
      <form action={action} className="flex flex-col gap-[18px]" noValidate>
        <input type="hidden" name="next" value={next ?? ""} />
        <div>
          <h1 className="t-headline-lg font-extrabold">Initialize Reality</h1>
          <p className="t-body-lg mt-2.5 text-on-surface-variant">
            Verify your existence to access your bottled concepts.
          </p>
        </div>
        <FormError message={state?.error} />
        <Field
          label="Inter-dimensional Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state?.values?.email}
          placeholder="you@nebula.local"
          icon={AtSign}
          error={state?.fieldErrors?.email}
          required
        />
        <Field
          label="Secret Sequence"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          icon={Lock}
          error={state?.fieldErrors?.password}
          required
        />
        <Button type="submit" size="xl" className="mt-2 h-16" loading={pending}>
          Log into Reality
        </Button>
        <p className="t-body-md text-center text-on-surface-variant">
          New soul?{" "}
          <Link href={signUpHref} className="font-bold text-primary hover:underline">
            Draft a New Identity
          </Link>
        </p>
        <hr className="border-outline-variant/35" />
        <p className="t-caption flex items-center justify-center gap-2 text-[11px] uppercase tracking-[1.1px] text-on-surface-variant/70">
          <ShieldCheck className="size-[18px]" aria-hidden /> 100% non-linear encryption
        </p>
      </form>
    </AuthCard>
  );
}

export function SignUpForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signUp, undefined);
  const signInHref = next ? `/signin?next=${encodeURIComponent(next)}` : "/signin";

  return (
    <AuthCard>
      <form action={action} className="flex flex-col gap-[18px]" noValidate>
        <input type="hidden" name="next" value={next ?? ""} />
        <div>
          <h1 className="t-headline-lg font-extrabold">Initialize Manifesto</h1>
          <p className="t-body-lg mt-2.5 text-on-surface-variant">
            Step into the loop. Your earthly data is safe with our sentient servers.
          </p>
        </div>
        <FormError message={state?.error} />
        <Field
          label="Your Earthly Alias"
          name="name"
          autoComplete="name"
          defaultValue={state?.values?.name}
          placeholder="e.g., Major Tom"
          icon={User}
          error={state?.fieldErrors?.name}
          required
        />
        <Field
          label="Inter-dimensional Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state?.values?.email}
          placeholder="tom@the-void.space"
          icon={AtSign}
          error={state?.fieldErrors?.email}
          required
        />
        <Field
          label="Create a Paradox"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••••••"
          icon={Lock}
          error={state?.fieldErrors?.password}
          required
        />
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" name="terms" required className="mt-1.5 size-5 shrink-0 accent-primary" />
            <span className="t-body-md text-[15px] text-on-surface-variant">
              I agree to the <span className="font-bold text-primary">laws of temporal causality</span> and
              understand that my future self may have already signed this.
            </span>
          </label>
          {state?.fieldErrors?.terms && (
            <p className="mt-1.5 px-2 text-sm text-error" role="alert">
              {state.fieldErrors.terms}
            </p>
          )}
        </div>
        <Button type="submit" size="xl" className="mt-2 h-16" loading={pending}>
          Manifest My Account
        </Button>
        <p className="t-body-md text-center text-on-surface-variant">
          Already exist in our database?{" "}
          <Link href={signInHref} className="font-bold text-primary hover:underline">
            Collapse back into login
          </Link>
        </p>
        <hr className="border-outline-variant/35" />
        <p className="t-caption flex items-center justify-center gap-2 text-[11px] uppercase tracking-[1.1px] text-on-surface-variant/70">
          <ShieldCheck className="size-[18px]" aria-hidden /> Paradox-free security as standard
        </p>
      </form>
    </AuthCard>
  );
}
