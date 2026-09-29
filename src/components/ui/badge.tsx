import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-surface-container-highest text-on-surface-variant",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary-container/30 text-on-tertiary-container",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-sky-100 text-sky-800",
} as const;

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "t-caption inline-flex items-center rounded-full px-3 py-1.5 uppercase tracking-wider",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
