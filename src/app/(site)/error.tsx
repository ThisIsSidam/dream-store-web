"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/state";

export default function SiteError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      className="min-h-[60vh]"
      message={error.message || "An unexpected error occurred."}
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
