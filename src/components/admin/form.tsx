import { useId } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm outline-none transition-shadow placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 disabled:opacity-60";

export function AdminField({
  label,
  hint,
  className,
  multiline,
  ...props
}: {
  label: string;
  hint?: string;
  multiline?: boolean;
} & Omit<React.ComponentProps<"input">, "ref"> &
  Partial<Pick<React.ComponentProps<"textarea">, "rows">>) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={props.rows ?? 4}
          className={cn(inputClass, "h-auto py-2")}
          {...(props as React.ComponentProps<"textarea">)}
        />
      ) : (
        <input id={id} className={inputClass} {...props} />
      )}
      {hint && <p className="text-xs text-on-surface-variant">{hint}</p>}
    </div>
  );
}

export const adminInputClass = inputClass;
