import { cn } from "@/lib/utils";

/** Standard page wrapper: max-width container plus an optional page title. */
export function PageShell({
  title,
  subtitle,
  width = "max-w-[1280px]",
  actions,
  children,
  className,
}: {
  title?: string;
  subtitle?: React.ReactNode;
  width?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-4 pb-20 pt-4 xs:pt-5", width, className)}>
      {title && (
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold sm:text-2xl">{title}</h1>
            {subtitle && <div className="mt-1 text-sm text-on-surface-variant">{subtitle}</div>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </div>
  );
}
