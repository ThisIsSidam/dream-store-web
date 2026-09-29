import Link from "next/link";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-[34px] place-items-center rounded-[10px] bg-primary text-on-primary">
        <Sparkles className="size-[19px]" aria-hidden />
      </span>
      <span className="font-display text-lg font-extrabold text-on-surface">{siteConfig.name}</span>
    </Link>
  );
}
