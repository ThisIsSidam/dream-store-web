"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldProps = Omit<React.ComponentProps<"input">, "className"> & {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  /** Text rendered on the right of the label row, e.g. "Forgot your timeline?" */
  labelAction?: React.ReactNode;
  className?: string;
};

/** The pill-shaped, icon-led input used on the auth pages. */
export function Field({ label, icon: Icon, error, labelAction, className, type, ...props }: FieldProps) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={className}>
      {(label || labelAction) && (
        <div className="mb-2.5 flex items-center justify-between px-0.5">
          {label && (
            <label htmlFor={id} className="t-label text-on-surface">
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant"
            aria-hidden
          />
        )}
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "t-body-md h-14 w-full rounded-full border-[1.6px] border-outline-variant/85 bg-surface-container-low px-5 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary-container focus:ring-2 focus:ring-primary-container/30",
            Icon && "pl-13",
            isPassword && "pr-13",
            error && "border-error",
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 px-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
