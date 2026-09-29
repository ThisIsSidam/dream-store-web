import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer rounded-2xl bg-surface-container-highest", className)} />;
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-4 min-[451px]:grid-cols-3 min-[801px]:grid-cols-4" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="rounded-[28px] border border-outline-variant/35 p-3.5">
          <Skeleton className="aspect-[1.05] rounded-3xl" />
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-5 h-7 w-1/3" />
        </li>
      ))}
    </ul>
  );
}
