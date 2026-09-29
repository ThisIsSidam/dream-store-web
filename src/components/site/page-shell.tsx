import { cn } from "@/lib/utils";

/** Standard page wrapper: max-width container plus a big page title. */
export function PageShell({
  title,
  subtitle,
  width = "max-w-7xl",
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
    <div className={cn("mx-auto w-full px-6 pb-24 pt-8 xs:pt-12", width, className)}>
      {title && (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 xs:mb-10">
          <div>
            <h1 className="t-display !text-[clamp(2.25rem,6vw,4rem)] !leading-[1.05] text-primary">{title}</h1>
            {subtitle && <div className="t-body-lg mt-4 text-on-surface-variant">{subtitle}</div>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </div>
  );
}
