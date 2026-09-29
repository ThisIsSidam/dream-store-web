import { Skeleton } from "@/components/site/loading";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-4" aria-busy>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-4 h-72 w-full" />
    </div>
  );
}
