import { Skeleton } from "@/components/site/loading";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12" aria-busy>
      <Skeleton className="h-12 w-72" />
      <Skeleton className="mt-4 h-6 w-96 max-w-full" />
      <Skeleton className="mt-10 h-72 w-full" />
    </div>
  );
}
