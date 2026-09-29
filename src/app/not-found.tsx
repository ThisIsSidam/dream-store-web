import { SearchX } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
        action={<LinkButton href="/">Go to homepage</LinkButton>}
      />
    </div>
  );
}
