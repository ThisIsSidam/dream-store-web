"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/state";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface">
      <ErrorState
        message={error.message || "An unexpected error occurred."}
        action={<Button onClick={reset}>Try again</Button>}
      />
    </div>
  );
}
