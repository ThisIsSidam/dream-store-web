import Link from "next/link";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "/",
  tone = "dark",
}: {
  className?: string;
  href?: string;
  /** "light" is for use on the red header. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-sm",
          light ? "bg-white text-primary" : "bg-primary text-on-primary",
        )}
      >
        <Sparkles className="size-[18px]" aria-hidden />
      </span>
      <span className={cn("font-display text-xl font-extrabold italic", light ? "text-white" : "text-on-surface")}>
        {siteConfig.name}
      </span>
    </Link>
  );
}
