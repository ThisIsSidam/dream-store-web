import { cn } from "@/lib/utils";
import Link from "next/link";

export function BrandMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Precision square container with subtle rounded corners */}
      <rect width="32" height="32" rx="7" className="fill-neutral-900" />
      {/* Abstract Y mark with quantum bifurcation and central singularity */}
      <path
        d="M9 8.5L16 16.5M23 8.5L16 16.5M16 16.5V24.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mysterious focal dot */}
      <circle cx="16" cy="11.5" r="1.5" className="fill-indigo-400" />
    </svg>
  );
}

export function BrandLogo({
  className,
  href = "/",
  tone = "dark",
}: {
  className?: string;
  href?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <BrandMark className="size-8 transition-transform group-hover:scale-105" />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-sans text-lg font-bold tracking-tight leading-none",
            isLight ? "text-white" : "text-neutral-900",
          )}
        >
          Y-Combinonsense
        </span>
        <span
          className={cn(
            "text-[9px] font-medium tracking-widest uppercase mt-0.5",
            isLight ? "text-neutral-400" : "text-neutral-500",
          )}
        >
          Questionable Marketplace
        </span>
      </div>
    </Link>
  );
}
