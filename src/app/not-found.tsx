import { SearchX } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface">
      <EmptyState
        icon={SearchX}
        title="This reality doesn't exist"
        message="The page you're looking for was never manifested - or it was, and got returned."
        action={<LinkButton href="/">Back to the shop</LinkButton>}
      />
    </div>
  );
}
