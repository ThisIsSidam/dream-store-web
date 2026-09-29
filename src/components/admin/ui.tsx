import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, shortId } from "@/lib/utils";

export function AdminCard({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm", className)}
      {...props}
    />
  );
}

export function PageHeading({
  title,
  back,
  actions,
  children,
}: {
  title: string;
  back?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {back && (
          <Link
            href={back}
            aria-label="Back"
            className="grid size-10 shrink-0 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
          >
            <ArrowLeft className="size-5" />
          </Link>
        )}
        <h1 className="truncate text-2xl font-bold">{title}</h1>
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Overline({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">{children}</p>;
}

/** Table shell: scrolls horizontally on small screens. */
export function DataTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn("whitespace-nowrap bg-surface-container-low px-4 py-3 font-semibold text-on-surface-variant", className)}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("relative border-t border-outline-variant/30 transition-colors hover:bg-surface-container-low/70", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

/** Makes the whole table row clickable: put inside the row's main cell. */
export function RowLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("after:absolute after:inset-0 after:content-['']", className)}>
      {children}
    </Link>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center italic text-on-surface-variant">
        {children}
      </td>
    </tr>
  );
}

/** "#A1B2C3" pill linking to a user/product record; guests get a label instead. */
export function IdTag({ id, kind, plain }: { id: string; kind: "users" | "products"; plain?: boolean }) {
  // `plain` renders the pill without a link, for use inside another link.
  if (plain) {
    return kind === "users" && id.includes("-") ? (
      <Badge tone="warning">Guest</Badge>
    ) : (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        <span className="mr-1 opacity-60">#</span>
        {shortId(id)}
      </span>
    );
  }
  if (kind === "users" && id.includes("-")) {
    return (
      <Link href={`/admin/users/${id}`} className="relative z-10">
        <Badge tone="warning">Guest</Badge>
      </Link>
    );
  }
  return (
    <Link
      href={`/admin/${kind}/${id}`}
      className="relative z-10 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/15"
    >
      <span className="mr-1 opacity-60">#</span>
      {shortId(id)}
    </Link>
  );
}

export function Stat({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </span>
      <span>
        <span className="block text-2xl font-bold">{value}</span>
        <span className="text-sm text-on-surface-variant">{label}</span>
      </span>
    </Link>
  );
}
